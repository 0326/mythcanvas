export type ReferenceAssetRecord = {
  id: string;
  ownerType: 'character' | 'character_variant' | 'style';
  ownerId: string;
  characterInterpretationId?: string;
  assetType: string;
  assetKey: string;
  mimeType: string;
  width?: number;
  height?: number;
  altText: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
};

export type GenerationReferenceImage = {
  id: string;
  assetType: string;
  mimeType: string;
  bytes: Uint8Array;
};

const referencePriority = [
  'portrait-front',
  'portrait-three-quarter',
  'fullbody-front',
  'fullbody-three-quarter',
  'signature-props',
  'turnaround',
  'expression-sheet',
] as const;

export async function listReferenceAssetRecords(
  db: D1Database | undefined,
  characterId: string,
  variantId?: string,
  interpretationId?: string,
  includeArchived = false,
): Promise<ReferenceAssetRecord[]> {
  if (!db) return [];

  const clauses = [
    `(owner_type = 'character' AND owner_id = ? AND character_interpretation_id IS NULL)`,
    ...(interpretationId
      ? [`(owner_type = 'character' AND owner_id = ? AND character_interpretation_id = ?)`]
      : []),
    ...(variantId ? [`(owner_type = 'character_variant' AND owner_id = ?)`] : []),
  ];
  const params = [
    characterId,
    ...(interpretationId ? [characterId, interpretationId] : []),
    ...(variantId ? [variantId] : []),
  ];

  try {
    const rows = await db.prepare(`
      SELECT id, owner_type, owner_id, character_interpretation_id, asset_type, asset_key, asset_mime,
             width, height, alt_text, status, created_at
      FROM reference_assets
      WHERE (${clauses.join(' OR ')}) ${includeArchived ? '' : `AND status = 'active'`}
      ORDER BY CASE asset_type
        WHEN 'portrait-front' THEN 1
        WHEN 'portrait-three-quarter' THEN 2
        WHEN 'fullbody-front' THEN 3
        WHEN 'fullbody-three-quarter' THEN 4
        WHEN 'signature-props' THEN 5
        WHEN 'turnaround' THEN 6
        WHEN 'expression-sheet' THEN 7
        ELSE 8
      END, created_at ASC
    `).bind(...params).all<Record<string, unknown>>();

    return rows.results.map(mapReferenceAssetRow);
  } catch {
    return [];
  }
}

export async function loadGenerationReferenceImages(
  db: D1Database | undefined,
  bucket: R2Bucket | undefined,
  characterId: string,
  variantId?: string,
  interpretationId?: string,
  maxImages = 4,
): Promise<GenerationReferenceImage[]> {
  if (!db || !bucket) return [];

  const records = await listReferenceAssetRecords(db, characterId, variantId, interpretationId);
  if (!records.length) return [];

  // Variant-specific references should override equivalent canonical slots while
  // canonical references continue to anchor identity for slots the variant does not replace.
  const ordered = dedupeReferenceSlots(records, variantId, interpretationId).slice(0, maxImages);
  const loaded: GenerationReferenceImage[] = [];

  for (const record of ordered) {
    try {
      const object = await bucket.get(record.assetKey);
      if (!object) continue;
      const buffer = await object.arrayBuffer();
      loaded.push({
        id: record.id,
        assetType: record.assetType,
        mimeType: record.mimeType || object.httpMetadata?.contentType || 'image/png',
        bytes: new Uint8Array(buffer),
      });
    } catch {
      // A missing/corrupt reference must not make the Creator unusable.
    }
  }

  return loaded;
}

export async function insertReferenceAsset(
  db: D1Database | undefined,
  input: Omit<ReferenceAssetRecord, 'status' | 'createdAt'> & { sourceType?: string; license?: string },
): Promise<void> {
  if (!db) throw new Error('D1 is required to register reference assets.');

  await db.prepare(`
    INSERT INTO reference_assets (
      id, owner_type, owner_id, character_interpretation_id, asset_type, asset_key, asset_mime,
      width, height, alt_text, source_type, license, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `).bind(
    input.id,
    input.ownerType,
    input.ownerId,
    input.characterInterpretationId ?? null,
    input.assetType,
    input.assetKey,
    input.mimeType,
    input.width ?? null,
    input.height ?? null,
    input.altText,
    input.sourceType ?? 'platform',
    input.license ?? 'MythCanvas internal reference asset',
  ).run();
}

export async function archiveReferenceAsset(db: D1Database | undefined, id: string): Promise<boolean> {
  if (!db) return false;
  const result = await db.prepare(`
    UPDATE reference_assets SET status = 'archived', updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status != 'archived'
  `).bind(id).run();
  return Boolean(result.meta.changes);
}

export async function appendVariantReferenceAsset(
  db: D1Database | undefined,
  variantId: string,
  referenceId: string,
): Promise<void> {
  if (!db) return;
  const row = await db.prepare(`SELECT reference_pack_json FROM character_variants WHERE id = ?`).bind(variantId).first<Record<string, unknown>>();
  if (!row) return;
  const current = stringArray(row.reference_pack_json);
  if (!current.includes(referenceId)) current.push(referenceId);
  await db.prepare(`
    UPDATE character_variants SET reference_pack_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(JSON.stringify(current), variantId).run();
}

export async function removeVariantReferenceAsset(
  db: D1Database | undefined,
  variantId: string,
  referenceId: string,
): Promise<void> {
  if (!db) return;
  const row = await db.prepare(`SELECT reference_pack_json FROM character_variants WHERE id = ?`).bind(variantId).first<Record<string, unknown>>();
  if (!row) return;
  const next = stringArray(row.reference_pack_json).filter((id) => id !== referenceId);
  await db.prepare(`
    UPDATE character_variants SET reference_pack_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `).bind(JSON.stringify(next), variantId).run();
}

function dedupeReferenceSlots(
  records: ReferenceAssetRecord[],
  variantId?: string,
  interpretationId?: string,
): ReferenceAssetRecord[] {
  const bySlot = new Map<string, { record: ReferenceAssetRecord; rank: number }>();
  for (const record of records) {
    const isVariant = variantId && record.ownerType === 'character_variant' && record.ownerId === variantId;
    const isInterpretation = interpretationId && record.characterInterpretationId === interpretationId;
    const rank = isVariant ? 3 : isInterpretation ? 2 : 1;
    const existing = bySlot.get(record.assetType);
    if (!existing || rank >= existing.rank) bySlot.set(record.assetType, { record, rank });
  }

  return [...bySlot.values()].map(({ record }) => record).sort((a, b) => {
    const aIndex = referencePriority.indexOf(a.assetType as (typeof referencePriority)[number]);
    const bIndex = referencePriority.indexOf(b.assetType as (typeof referencePriority)[number]);
    return (aIndex < 0 ? 999 : aIndex) - (bIndex < 0 ? 999 : bIndex);
  });
}

function mapReferenceAssetRow(row: Record<string, unknown>): ReferenceAssetRecord {
  return {
    id: String(row.id),
    ownerType: String(row.owner_type) as ReferenceAssetRecord['ownerType'],
    ownerId: String(row.owner_id),
    characterInterpretationId: optionalString(row.character_interpretation_id),
    assetType: String(row.asset_type),
    assetKey: String(row.asset_key),
    mimeType: String(row.asset_mime),
    width: optionalNumber(row.width),
    height: optionalNumber(row.height),
    altText: String(row.alt_text ?? ''),
    status: String(row.status) as ReferenceAssetRecord['status'],
    createdAt: String(row.created_at),
  };
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== 'string' || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function optionalNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function optionalString(value: unknown): string | undefined {
  return value == null ? undefined : String(value);
}
