import type { ArtworkType } from '../types';

/** 查询过滤范围：默认仅已发布，'all' 用于后台/管理场景 */
export type PublishedFilter = 'published' | 'all';

export type Pagination = {
  limit?: number;
  offset?: number;
};

export type EntityListQuery = Pagination & {
  published?: PublishedFilter;
};

export type ArtworkListQuery = Pagination & {
  mythologyId?: string;
  realmId?: string;
  characterId?: string;
  styleId?: string;
  type?: ArtworkType;
  published?: PublishedFilter;
};
