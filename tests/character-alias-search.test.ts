import { describe, expect, it } from 'vitest';
import { searchAll } from '../src/lib/content/search';

describe('character alias search', () => {
  it('resolves an interpretation-scoped name to its one Character result', async () => {
    const db = {
      prepare(sql: string) {
        return {
          bind: (..._params: unknown[]) => ({
            all: async () => ({
              results: sql.includes('FROM characters AS c')
                ? [{
                    id: 'character-erlang-shen',
                    slug: 'erlang-shen',
                    name: '二郎神',
                    name_en: 'Erlang Shen',
                    role: '护国神与战神型神祇',
                    portrait_src: '',
                    matched_names: '杨戬',
                  }]
                : [],
            }),
          }),
        };
      },
    } as unknown as D1Database;

    const results = await searchAll(db, '杨戬');

    expect(results).toEqual([
      expect.objectContaining({
        type: 'character',
        id: 'character-erlang-shen',
        slug: 'erlang-shen',
        name: '二郎神',
        score: 2,
      }),
    ]);
  });
});
