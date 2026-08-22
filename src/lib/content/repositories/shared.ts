import type { Pagination } from './types';

/** D1 行字段 -> 可选字符串 */
export function optionalString(value: unknown): string | undefined {
  return value == null ? undefined : String(value);
}

/** D1 行字段 -> 可选数字 */
export function optionalNumber(value: unknown): number | undefined {
  if (value == null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** 解析 JSON 数组字段，失败返回空数组 */
export function parseStringArray(value: unknown): string[] {
  if (value == null) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** 解析 JSON 对象字段，失败返回 fallback */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return fallback;
  }
}

/** 生成安全的 LIMIT/OFFSET 分页参数 */
export function pageClause(query: Pagination): { limit: number; offset: number } {
  const limit = Math.min(Math.max(query.limit ?? 100, 1), 1000);
  const offset = Math.max(query.offset ?? 0, 0);
  return { limit, offset };
}
