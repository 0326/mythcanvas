import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getLocalizedCharacters,
  getLocalizedMythologies,
  getLocalizedWorlds,
} from '../src/lib/content/repositories/localized';

const root = process.cwd();
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('English content publication contract', () => {
  it('never falls back to Chinese static content when localized D1 data is unavailable', async () => {
    await expect(getLocalizedMythologies(undefined, 'en')).resolves.toEqual([]);
    await expect(getLocalizedWorlds(undefined, 'en')).resolves.toEqual([]);
    await expect(getLocalizedCharacters(undefined, 'en')).resolves.toEqual([]);
  });

  it('publishes all ten mythology landing translations', () => {
    const sql = read('migrations/0038_english_core_content.sql');
    const ids = [
      'myth-chinese',
      'myth-greek',
      'myth-norse',
      'myth-egyptian',
      'myth-indian',
      'myth-japanese',
      'myth-celtic',
      'myth-maya',
      'myth-aztec',
      'myth-mesopotamian',
    ];
    for (const id of ids) expect(sql, id).toContain(`('${id}','en'`);
  });

  it('publishes a curated multi-civilization English character set', () => {
    const sql = read('migrations/0038_english_core_content.sql');
    const requiredCharacters = [
      'character-change', 'character-erlang-shen',
      'character-athena', 'character-zeus',
      'character-odin', 'character-thor',
      'character-anubis', 'character-ra',
      'character-amaterasu', 'character-susanoo',
      'character-shiva', 'character-vishnu',
      'character-morrigan', 'character-cu-chulainn',
      'character-kukulkan', 'character-hunahpu',
      'character-quetzalcoatl', 'character-tlaloc',
      'character-gilgamesh', 'character-ishtar',
    ];
    for (const id of requiredCharacters) expect(sql, id).toContain(`('${id}','en'`);
    const publishedCharacterRows = sql.match(/\('character-[^']+','en'/g) ?? [];
    expect(publishedCharacterRows.length).toBeGreaterThanOrEqual(45);
  });

  it('keeps dedicated English SSR pages free of Han-script reader copy', () => {
    const pages = [
      'src/pages/_localized/en/index.astro',
      'src/pages/_localized/en/mythology/index.astro',
      'src/pages/_localized/en/mythology/[slug].astro',
      'src/pages/_localized/en/character/index.astro',
      'src/pages/_localized/en/character/[slug].astro',
      'src/pages/_localized/en/world/index.astro',
      'src/pages/_localized/en/world/[slug].astro',
    ];
    for (const page of pages) {
      expect(read(page), page).not.toMatch(/\p{Script=Han}/u);
    }
  });

  it('requires published translation rows in every localized repository join', () => {
    const source = read('src/lib/content/repositories/localized.ts');
    expect(source).toContain("t.translation_status = 'published'");
    expect(source).toContain('JOIN mythology_translations');
    expect(source).toContain('JOIN world_translations');
    expect(source).toContain('JOIN character_translations');
  });

  it('keeps the English global navigation inside the localized core surface', () => {
    const header = read('src/components/Header.astro');
    const footer = read('src/components/Footer.astro');
    expect(header).toContain("const isEnglish = locale === 'en'");
    expect(header).toContain('{!isEnglish && <a class="header-icon"');
    expect(footer).toContain('Chinese edition');
    expect(footer).toContain('{isEnglish ? (');
  });
});
