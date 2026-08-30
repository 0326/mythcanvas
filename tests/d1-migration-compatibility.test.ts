import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationsDir = new URL('../migrations/', import.meta.url);

describe('D1 migration compatibility', () => {
  it('does not toggle PRAGMA foreign_keys inside migrations', () => {
    const offenders = readdirSync(migrationsDir)
      .filter((name) => name.endsWith('.sql'))
      .filter((name) => {
        const source = readFileSync(join(migrationsDir.pathname, name), 'utf8');
        return /PRAGMA\s+foreign_keys\s*=\s*(?:ON|OFF|TRUE|FALSE|1|0)/i.test(source);
      });

    expect(offenders).toEqual([]);
  });
});
