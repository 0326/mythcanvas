// Temporary idempotent codemod for the Lucide migration branch.
import fs from 'node:fs';

const replacements = new Map();

const queue = (file, find, replace) => {
  const list = replacements.get(file) ?? [];
  list.push([find, replace]);
  replacements.set(file, list);
};

queue(
  'src/pages/index.astro',
  "import BaseLayout from '../layouts/BaseLayout.astro';",
  "import { ArrowRight, Sparkles } from '@lucide/astro';\nimport BaseLayout from '../layouts/BaseLayout.astro';",
);
queue(
  'src/pages/index.astro',
  '<a class="btn btn-primary" href="/explore/">探索神境 <span aria-hidden="true">→</span></a>',
  '<a class="btn btn-primary" href="/explore/">探索神境 <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" /></a>',
);
queue(
  'src/pages/index.astro',
  '<div class="create-orbit" aria-hidden="true"><span>✦</span></div>',
  '<div class="create-orbit" aria-hidden="true"><Sparkles size={35} strokeWidth={1.5} /></div>',
);
queue(
  'src/pages/index.astro',
  '    place-items: center;\n    margin-inline: auto;',
  '    place-items: center;\n    margin-inline: auto;\n    color: var(--accent);',
);

queue(
  'src/pages/explore/index.astro',
  "import BaseLayout from '../../layouts/BaseLayout.astro';",
  "import { MoonStar } from '@lucide/astro';\nimport BaseLayout from '../../layouts/BaseLayout.astro';",
);
queue(
  'src/pages/explore/index.astro',
  '<span aria-hidden="true">☾</span>',
  '<span aria-hidden="true"><MoonStar size={36} strokeWidth={1.5} /></span>',
);

queue(
  'src/pages/create/index.astro',
  "import BaseLayout from '../../layouts/BaseLayout.astro';",
  "import { Landmark, Sparkles } from '@lucide/astro';\nimport BaseLayout from '../../layouts/BaseLayout.astro';",
);
queue(
  'src/pages/create/index.astro',
  '<span class="entity-glyph">◇</span>',
  '<span class="entity-glyph" aria-hidden="true"><Landmark size={18} strokeWidth={1.8} /></span>',
);
queue(
  'src/pages/create/index.astro',
  '<button class="btn btn-primary generate-button" type="button" data-generate>开始绘神 <span aria-hidden="true">✦</span></button>',
  '<button class="btn btn-primary generate-button" type="button" data-generate><span data-generate-label>开始绘神</span><Sparkles size={17} strokeWidth={1.8} aria-hidden="true" /></button>',
);
queue(
  'src/pages/create/index.astro',
  "      button.disabled = busy;\n      button.textContent = label;",
  "      button.disabled = busy;\n      const labelNode = button.querySelector('[data-generate-label]');\n      if (labelNode) labelNode.textContent = label;",
);
queue('src/pages/create/index.astro', "setBusy(false, '再绘一次 ✦');", "setBusy(false, '再绘一次');");
queue('src/pages/create/index.astro', "setBusy(false, '重新绘神 ✦');", "setBusy(false, '重新绘神');");
queue(
  'src/pages/create/index.astro',
  '  .generate-button { width: 100%; min-height: 52px; }',
  '  .generate-button { width: 100%; min-height: 52px; display: inline-flex; align-items: center; justify-content: center; gap: .45rem; }',
);

const agentIconSection = `### Icon system\n\n- Functional UI icons MUST use \`@lucide/astro\` with named imports.\n- Do not use emoji or Unicode glyphs as buttons, navigation, status, action, search, theme, favorite, download, user, notification, or directional icons.\n- Prefer semantic icon names so AI agents can infer intent: \`Search\`, \`Moon\`, \`Sun\`, \`Heart\`, \`Download\`, \`UserRound\`, \`Sparkles\`, \`ArrowRight\`.\n- Default UI icon size is 16–20px with stroke width around 1.75–2 unless the composition requires otherwise.\n- Icon-only controls must have an accessible \`aria-label\`; purely decorative icons must use \`aria-hidden=\"true\"\`.\n- Civilization Visual DNA and MythCanvas brand motifs may use custom SVG when Lucide has no culturally appropriate symbol. These are content/brand symbols, not general UI icons.\n- Do not mix Phosphor, Tabler, Heroicons, or another general-purpose icon library into normal UI without an explicit design-system migration decision.\n- Never signal state only through an icon or color; preserve text/ARIA state where needed.\n\n`;
queue(
  'AGENTS.md',
  '### Shared\n\n- heading can use serif; body/forms/buttons use readable sans-serif',
  `### Shared\n\n${agentIconSection}- heading can use serif; body/forms/buttons use readable sans-serif`,
);

const skillIconSection = `## Icon system\n\nMythCanvas uses **Lucide** as the functional UI icon system.\n\n- Import icons from \`@lucide/astro\` by semantic name.\n- Do not use emoji / Unicode glyphs for functional UI.\n- Typical UI size: 16–20px; keep stroke weight visually consistent.\n- Icon-only actions require \`aria-label\`; decorative icons use \`aria-hidden=\"true\"\`.\n- Custom SVG is reserved for MythCanvas brand marks and Civilization Visual DNA motifs that generic UI libraries should not represent.\n- Do not mix multiple general-purpose icon libraries.\n- Prefer text + icon for primary actions; use icon-only controls only when the meaning is conventional and accessible.\n\n`;
queue(
  '.agents/skills/mythcanvas-product-ux/SKILL.md',
  '## Typography\n',
  `${skillIconSection}## Typography\n`,
);

let changed = 0;
for (const [file, fileReplacements] of replacements) {
  let source = fs.readFileSync(file, 'utf8');
  let touched = false;
  for (const [find, replace] of fileReplacements) {
    if (source.includes(replace)) continue;
    if (!source.includes(find)) {
      throw new Error(`Expected migration anchor not found in ${file}: ${find.slice(0, 100)}`);
    }
    source = source.replace(find, replace);
    touched = true;
  }
  if (touched) {
    fs.writeFileSync(file, source);
    changed += 1;
  }
}

console.log(`Lucide migration updated ${changed} files.`);
