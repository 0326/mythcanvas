/**
 * 内容审核（content_submissions）数据访问层。
 * 用户可"申请公开"自己的生成作品；运营在后台审核通过后发布进 Explore。
 */

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export type ContentSubmission = {
  id: string;
  generationId: string;
  userId?: string;
  name: string;
  title: string;
  altText: string;
  status: SubmissionStatus;
  reviewNote?: string;
  reviewedAt?: string;
  artworkId?: string;
  createdAt: string;
};

export async function createSubmission(
  db: D1Database | undefined,
  input: {
    id: string;
    generationId: string;
    userId?: string;
    name: string;
    title: string;
    altText?: string;
  },
): Promise<void> {
  if (!db) return;
  await db
    .prepare(
      `INSERT OR IGNORE INTO content_submissions (id, generation_id, user_id, name, title, alt_text)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(input.id, input.generationId, input.userId ?? null, input.name, input.title, input.altText ?? '')
    .run();
}

export async function listSubmissions(
  db: D1Database | undefined,
  status?: SubmissionStatus,
): Promise<ContentSubmission[]> {
  if (!db) return [];
  const rows = await db
    .prepare(
      `SELECT id, generation_id, user_id, name, title, alt_text, status, review_note, reviewed_at, artwork_id, created_at
       FROM content_submissions
       ${status ? 'WHERE status = ?' : ''}
       ORDER BY created_at DESC`,
    )
    .bind(...(status ? [status] : []))
    .all();
  return rows.results.map(mapSubmission);
}

export async function getSubmission(db: D1Database | undefined, id: string): Promise<ContentSubmission | null> {
  if (!db) return null;
  const row = await db
    .prepare(
      `SELECT id, generation_id, user_id, name, title, alt_text, status, review_note, reviewed_at, artwork_id, created_at
       FROM content_submissions WHERE id = ?`,
    )
    .bind(id)
    .first();
  return row ? mapSubmission(row) : null;
}

/** 查询某生成作品是否已有待审核提交（防止重复刷审核队列） */
export async function getPendingSubmissionByGeneration(
  db: D1Database | undefined,
  generationId: string,
): Promise<ContentSubmission | null> {
  if (!db) return null;
  const row = await db
    .prepare(
      `SELECT id, generation_id, user_id, name, title, alt_text, status, review_note, reviewed_at, artwork_id, created_at
       FROM content_submissions WHERE generation_id = ? AND status = 'pending' LIMIT 1`,
    )
    .bind(generationId)
    .first();
  return row ? mapSubmission(row) : null;
}

function mapSubmission(row: Record<string, unknown>): ContentSubmission {
  return {
    id: String(row.id),
    generationId: String(row.generation_id),
    userId: row.user_id == null ? undefined : String(row.user_id),
    name: String(row.name),
    title: String(row.title),
    altText: String(row.alt_text ?? ''),
    status: String(row.status) as SubmissionStatus,
    reviewNote: row.review_note == null ? undefined : String(row.review_note),
    reviewedAt: row.reviewed_at == null ? undefined : String(row.reviewed_at),
    artworkId: row.artwork_id == null ? undefined : String(row.artwork_id),
    createdAt: String(row.created_at),
  };
}