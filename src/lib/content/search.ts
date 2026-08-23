/**
 * 全站搜索数据访问层（D1 LIKE 前缀/包含匹配，V1 MVP）。
 * 支持 Mythology / Realm / Character / Artwork 四类结果，中英文名称匹配。
 */

export type SearchResult = {
  type: 'mythology' | 'realm' | 'character' | 'artwork';
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  score: number;
};

export async function searchAll(
  db: D1Database | undefined,
  query: string,
  limit = 24,
): Promise<SearchResult[]> {
  const term = query.trim();
  if (!term) return [];

  const results: SearchResult[] = [];
  const tasks = [
    searchMythologies(db, term).then((items) => results.push(...items)),
    searchRealms(db, term).then((items) => results.push(...items)),
    searchCharacters(db, term).then((items) => results.push(...items)),
    searchArtworks(db, term).then((items) => results.push(...items)),
  ];
  await Promise.all(tasks);

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 用 fuzzy 最短编辑距离估算相关度（前缀全命中最高，包含命中次之）。
 * 为轻量实现：prefix=2.0，contains=1.0，词序/拼音不处理。
 */
function scoreName(name: string[], nameEn: string, termLower: string): number {
  let best = 0;
  for (const part of name) {
    const lower = part.toLowerCase();
    if (lower.startsWith(termLower)) best = Math.max(best, 2);
    else if (lower.includes(termLower)) best = Math.max(best, 1);
  }
  const en = nameEn.toLowerCase();
  if (en.startsWith(termLower)) best = Math.max(best, 2);
  else if (en.includes(termLower)) best = Math.max(best, 1);
  return best;
}

async function searchMythologies(db: D1Database | undefined, term: string): Promise<SearchResult[]> {
  const termLower = term.toLowerCase();
  const rows = await queryRows(
    db,
    `SELECT id, slug, name, name_en, summary, hero_src FROM mythologies WHERE publish_status='published' AND (name LIKE ? OR name_en LIKE ? OR summary LIKE ?)`,
    [`%${term}%`, `%${term}%`, `%${term}%`],
  );
  return rows.map((row) => ({
    type: 'mythology' as const,
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    subtitle: String(row.name_en),
    image: String(row.hero_src ?? ''),
    score: scoreName([String(row.name)], String(row.name_en), termLower),
  }));
}

async function searchRealms(db: D1Database | undefined, term: string): Promise<SearchResult[]> {
  const termLower = term.toLowerCase();
  const rows = await queryRows(
    db,
    `SELECT id, slug, name, name_en, summary, hero_src FROM realms WHERE publish_status='published' AND (name LIKE ? OR name_en LIKE ? OR summary LIKE ?)`,
    [`%${term}%`, `%${term}%`, `%${term}%`],
  );
  return rows.map((row) => ({
    type: 'realm' as const,
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    subtitle: String(row.name_en),
    image: String(row.hero_src ?? ''),
    score: scoreName([String(row.name)], String(row.name_en), termLower),
  }));
}

async function searchCharacters(db: D1Database | undefined, term: string): Promise<SearchResult[]> {
  const termLower = term.toLowerCase();
  const rows = await queryRows(
    db,
    `SELECT id, slug, name, name_en, role, portrait_src FROM characters WHERE publish_status='published' AND (name LIKE ? OR name_en LIKE ? OR role LIKE ? OR summary LIKE ?)`,
    [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`],
  );
  return rows.map((row) => ({
    type: 'character' as const,
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    subtitle: String(row.role),
    image: String(row.portrait_src ?? ''),
    score: scoreName([String(row.name)], String(row.name_en), termLower),
  }));
}

async function searchArtworks(db: D1Database | undefined, term: string): Promise<SearchResult[]> {
  const termLower = term.toLowerCase();
  const rows = await queryRows(
    db,
    `SELECT id, slug, title, alt_text, asset_key FROM artworks WHERE publish_status='published' AND review_status='approved' AND (title LIKE ? OR alt_text LIKE ?)`,
    [`%${term}%`, `%${term}%`],
  );
  return rows.map((row) => ({
    type: 'artwork' as const,
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.title),
    subtitle: String(row.alt_text),
    image: String(row.asset_key ?? ''),
    score: scoreName([String(row.title)], '', termLower),
  }));
}

async function queryRows(
  db: D1Database | undefined,
  sql: string,
  params: string[],
  limit = 30,
): Promise<Record<string, unknown>[]> {
  if (!db) return [];
  const rows = await db.prepare(`${sql} LIMIT ?`).bind(...params, String(limit)).all();
  return rows.results;
}