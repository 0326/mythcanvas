#!/usr/bin/env node
/** Generate a public-catalog artwork coverage report without reading D1. */
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const outputPath = path.resolve('docs/ARTWORK_COVERAGE_AUDIT_2026-09-03.md');
const vite = await createServer({
  root: process.cwd(),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

try {
  const { publicCatalog } = await vite.ssrLoadModule('/src/lib/content/public-catalog.ts');
  const rows = publicCatalog.mythologies.map((mythology) => {
    const characters = publicCatalog.characters.filter((character) => character.mythologyId === mythology.id);
    const withImage = characters.filter((character) => Boolean(character.portrait));
    const artworks = publicCatalog.curatedArtworks.filter((artwork) => artwork.mythologyId === mythology.id);
    const characterArtworks = artworks.filter((artwork) => artwork.type === 'character');
    return { mythology, characters, withImage, artworks, characterArtworks };
  });

  const totalCharacters = publicCatalog.characters.length;
  const charactersWithImage = publicCatalog.characters.filter((character) => Boolean(character.portrait)).length;
  const missingCharacters = totalCharacters - charactersWithImage;
  const catalogCharacterIds = new Set(publicCatalog.characters.map((character) => character.id));
  const artworkCharacterIds = new Set(publicCatalog.curatedArtworks.flatMap((artwork) => artwork.characterIds ?? []));
  const orphanArtworkCharacterIds = [...artworkCharacterIds].filter((characterId) => !catalogCharacterIds.has(characterId)).sort();
  const generatedAt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
  const lines = [
    '# MythCanvas 角色图片覆盖审计',
    '',
    `> 生成日期：${generatedAt}`,
    '>',
    '> 数据口径：构建期 `PublicContentCatalog`，不读取远程 D1。角色标记“已有图片”表示最终公开目录中的 `Character.portrait` 存在；该 portrait 可以来自种子内容，也可以由已发布 canonical Artwork 自动派生。',
    '',
    '## 总览',
    '',
    `- 静态角色总数：${totalCharacters}`,
    `- 已有角色图片：${charactersWithImage}`,
    `- 没有角色图片：${missingCharacters}`,
    `- 静态已发布 Artwork：${publicCatalog.curatedArtworks.filter((artwork) => artwork.reviewStatus === 'approved').length}`,
    `- 有 Artwork 关联但未进入静态角色目录：${orphanArtworkCharacterIds.length}`,
    ...(orphanArtworkCharacterIds.length > 0
      ? [`- 对应角色 ID：${orphanArtworkCharacterIds.map((characterId) => `\`${characterId}\``).join('、')}`]
      : []),
    '',
    '| 神话体系 | 角色数 | 有图片 | 无图片 | 角色类 Artwork | 全部 Artwork | 状态 |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- |',
  ];

  for (const row of rows) {
    const { mythology, characters, withImage, artworks, characterArtworks } = row;
    const missing = characters.length - withImage.length;
    const status = characters.length === 0 ? '角色未进入静态目录' : missing === 0 ? '已覆盖' : '需要补图';
    lines.push(`| ${mythology.name} | ${characters.length} | ${withImage.length} | ${missing} | ${characterArtworks.length} | ${artworks.length} | ${status} |`);
  }

  lines.push('', '## 无图片角色明细', '');
  for (const row of rows) {
    const missing = row.characters.filter((character) => !character.portrait);
    lines.push(`### ${row.mythology.name}（${missing.length} 个）`, '');
    if (row.characters.length === 0) {
      lines.push('该体系当前没有角色进入静态 `PublicContentCatalog`，需要先完成角色内容注册，再进入图片生产。', '');
      continue;
    }
    if (missing.length === 0) {
      lines.push('无。', '');
      continue;
    }
    lines.push(missing.map((character) => '- ' + character.name + '（`' + character.slug + '`）').join('\n'), '');
  }

  lines.push(
    '## 建议补图顺序',
    '',
    '1. **P0：体系入口和核心角色**：优先处理印度角色注册，以及埃及、希腊、日本、美索不达米亚、玛雅、阿兹特克、凯尔特的核心角色；这些体系当前缺图比例最高。',
    '2. **P1：完整 canonical 覆盖**：每个角色至少补一张 `canonical` 手机图；核心角色再补 `canonical` PC 图，避免角色卡和详情页继续出现符号兜底。',
    '3. **P2：Style 变体**：canonical 覆盖完成后，再补 Anime、Cinematic、Sacred 等风格，不能用风格变体替代角色 canonical 身份图。',
    '',
    '## 正确补图流程',
    '',
    '```text',
    'Character / CharacterVariant + VisualDNA + Style + OutputSpec',
    '→ 生成并完成身份 / 风格 / 壁纸规格 QA',
    '→ 上传 R2',
    '→ 导入并审核为 published + approved',
    '→ npm run content:export-artworks（从本地 D1 镜像导出）',
    '→ 构建部署',
    '```',
    '',
    '注意：没有图片的角色仍保留符号兜底是当前设计行为；不要把神话体系 Hero 或通用占位图伪装成角色肖像。',
    '',
  );

  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Wrote static artwork coverage report to ${path.relative(process.cwd(), outputPath)}.`);
} finally {
  await vite.close();
}
