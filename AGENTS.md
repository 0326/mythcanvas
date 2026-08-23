# AGENTS.md — MythCanvas AI Development Guide

This file is the canonical repository instruction for AI coding agents.

## 1. Product identity

**绘神宇宙 MythCanvas**  
Slogan: **用 AI 重现神话世界**

MythCanvas is a mythology visual exploration and AI creation product. It is not a generic image-generation dashboard and not a wallpaper dump site.

The main product loop is:

```text
Discover artwork
→ explore Character / Realm
→ download / favorite
→ create a personalized variant
→ build My Universe
```

Before product or UX changes, read `docs/PRODUCT.md`.
Before structural/backend changes, read `docs/ARCHITECTURE.md`.

---

## 2. Non-negotiable product rules

### One application, two visual themes

There is one MythCanvas component and information architecture.

- Light: **天宫鎏金**
- Dark: **月渺仙阙**

Theme switching may change semantic colors, shadows, glows, textures and theme-specific Hero art direction. It must not change page structure, grid, component size, typography metrics or CTA placement.

### Cultural identity is content-level

Every mythology has a `Civilization Visual DNA`, but civilizations do **not** receive separate website themes.

### Characters and realms are persistent assets

Important Character and Realm entities have a `Canonical Design`. Style variants may change rendering style but should preserve identity anchors.

### Image-first UX

Artwork should visually dominate UI chrome. Avoid game HUDs, SaaS dashboards, excessive pills, dense control panels and decorative pseudo-traditional UI.

### AI Creator is guided, not prompt-first

Do not default to a blank large prompt box. Build structured creation from Character/Realm + style + scene + composition, with free text as an optional advanced input.

---

## 3. Technical defaults

- Keep **Astro** as the application framework.
- Prefer SSR/SSG/server-rendered Astro for crawlable content.
- Add hydration only for components that require interaction.
- React is allowed for justified islands; do not convert the site into a React SPA.
- Runtime target is Cloudflare Workers.
- Planned persistence: D1 for relational metadata, R2 for images, KV for config/cache.
- TypeScript is required for domain and service code.

If React is introduced, add `@astrojs/react`, `react`, and `react-dom` deliberately and document which islands use it.

---

## 4. Source structure rules

Target structure is documented in `docs/ARCHITECTURE.md`.

General placement:

- `src/pages/`: routes only; keep page orchestration readable.
- `src/components/ui/`: reusable visual primitives.
- `src/components/{artwork,character,realm,mythology,create}/`: domain components.
- `src/lib/`: reusable domain/service logic; no UI.
- `src/data/`: temporary typed MVP seed data.
- `src/content/`: editorial/static content collections.
- `src/styles/`: tokens, themes, typography, global CSS.

Do not place business/domain logic in large `.astro` page frontmatter blocks when it belongs in `src/lib`.

---

## 5. Domain vocabulary

Use these names consistently:

- `Mythology`: civilization/mythology system, e.g. Chinese, Greek.
- `Realm`: a mythic world/domain, e.g. Olympus, Heavenly Palace.
- `Character`: god, hero, spirit or named mythic figure.
- `Scene`: named or reusable visual location/event concept.
- `Artwork`: a visual work and its image metadata.
- `Style`: visual rendering style such as Cinematic or Anime.
- `VisualDNA`: civilization identity constraints.
- `CanonicalDesign`: stable identity anchors for a Character or Realm.
- `Theme`: application Light/Dark presentation only.

Do not use `theme` to mean civilization or artwork style.

---

## 6. Theme implementation rules

Use semantic CSS variables.

Allowed:

```css
.component {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border);
}
```

Avoid hard-coded theme colors in domain components:

```css
/* avoid */
background: #fff;
color: #111;
```

Theme-specific files should own concrete values.

The first-paint theme script must avoid light/dark flash.

Respect `prefers-color-scheme` for first visit; persist explicit user selection.

---

## 7. UI rules

### Light / 天宫鎏金

- warm moon-white, cloud white, jade, pale cloud blue, restrained gold
- bright cloud/temple imagery
- modern Song/serif for major headings only
- surfaces feel like translucent white jade, not generic white cards

### Dark / 月渺仙阙

- deep navy/ink blue, moonlight white, restrained antique gold
- night clouds, moon, stars and illuminated celestial architecture
- never pure-black gothic/horror styling
- do not simply apply a black overlay to Light assets for key Hero art

### Shared

### Icon system

- Functional UI icons MUST use `@lucide/astro` with named imports.
- Do not use emoji or Unicode glyphs as buttons, navigation, status, action, search, theme, favorite, download, user, notification, or directional icons.
- Prefer semantic icon names so AI agents can infer intent: `Search`, `Moon`, `Sun`, `Heart`, `Download`, `UserRound`, `Sparkles`, `ArrowRight`.
- Default UI icon size is 16–20px with stroke width around 1.75–2 unless the composition requires otherwise.
- Icon-only controls must have an accessible `aria-label`; purely decorative icons must use `aria-hidden="true"`.
- Civilization Visual DNA and MythCanvas brand motifs may use custom SVG when Lucide has no culturally appropriate symbol. These are content/brand symbols, not general UI icons.
- Do not mix Phosphor, Tabler, Heroicons, or another general-purpose icon library into normal UI without an explicit design-system migration decision.
- Never signal state only through an icon or color; preserve text/ARIA state where needed.

- heading can use serif; body/forms/buttons use readable sans-serif
- card radius roughly 8–12px unless design requires otherwise
- motion should be slow, atmospheric and optional
- support `prefers-reduced-motion`
- avoid excessive blur/glass effects that reduce legibility

For any significant UI task, read `.agents/skills/mythcanvas-product-ux/SKILL.md`.

---

## 8. SEO / GEO rules

Core entity pages must be useful without JavaScript.

Every public content page should consider:

- unique `<title>` and description
- canonical URL
- semantic H1
- meaningful entity summary
- internal links to Character/Realm/Mythology relationships
- image `alt`, dimensions, responsive sources
- OpenGraph metadata
- structured data when appropriate
- sitemap inclusion

Never render important mythology facts only after a client fetch.

For SEO work, read `.agents/skills/mythcanvas-seo-geo/SKILL.md`.

---

## 9. Content and IP rules

Mythological/public-domain archetypes can be used as source material, but do not copy the specific visual design of modern anime, games, films or other copyrighted adaptations.

Examples:

- Athena: allowed as mythological subject.
- A specific modern game/anime Athena costume/design: do not reproduce.
- Sun Wukong: allowed as public myth/literary subject where applicable.
- Dragon Ball Goku: not a substitute for Sun Wukong reference.

Artwork metadata should be able to retain source/license/creator/model/prompt/review information.

For content modeling, read `.agents/skills/mythcanvas-content-model/SKILL.md`.

---

## 10. Performance rules

This is an image-heavy product. Treat image performance as architecture.

- always know image dimensions
- avoid layout shift
- use modern formats/derivatives when available
- lazy-load below-the-fold artwork
- do not lazy-load the primary LCP Hero image blindly
- keep shipped JavaScript small
- avoid hydrating static grids/cards only for hover effects
- prefer CSS for simple motion/interaction

---

## 11. Accessibility baseline

Every delivery should preserve:

- keyboard navigation
- visible focus states
- readable contrast in both themes
- semantic buttons/links
- dialog Escape/restore-focus behavior
- alt text strategy
- reduced-motion support
- status messages for async AI generation

---

## 12. Development workflow

Before coding:

1. Read the relevant product/architecture section.
2. Inspect existing implementation before inventing a new pattern.
3. Load the relevant Skill.
4. Identify whether the task is static content, interactive island, backend, or data modeling.
5. List the affected routes/components/domain types.

While coding:

1. Reuse semantic tokens.
2. Keep domain terms consistent.
3. Preserve server-rendered core content.
4. Implement Light and Dark together.
5. Include responsive behavior in the same task.
6. Add loading/empty/error states when applicable.

Before finishing:

1. Run `npm run check` when possible.
2. Verify Light and Dark.
3. Verify mobile and desktop.
4. Verify no core SEO content requires hydration.
5. Verify image semantics and no obvious layout shift.
6. Summarize files changed and any follow-up technical debt.

---

## 13. Page delivery checklist

For a new entity/detail page:

- [ ] Route and slug strategy match architecture
- [ ] Entity data is typed
- [ ] Hero supports MythCanvas theme
- [ ] Civilization Visual DNA is visible but not a full-site theme
- [ ] Canonical Design identity is preserved
- [ ] Style Variant section is explicit
- [ ] Related entity graph is present
- [ ] Download/favorite/create CTA hierarchy matches product spec
- [ ] Mobile layout exists
- [ ] Light and Dark share structure
- [ ] Metadata/canonical/OG are present
- [ ] Images have alt + dimensions
- [ ] No unnecessary full-page hydration

---

## 14. Avoid these shortcuts

- Do not rebuild the application as Next.js/React because a feature is interactive.
- Do not make five different site themes for five civilizations.
- Do not use one global `style` field for Theme + Visual DNA + Artwork Style.
- Do not copy generated mockup text/spacing literally without validating UX.
- Do not add a giant global state library before there is a real need.
- Do not put model provider secrets in browser code.
- Do not make AI generation dependent on user-written expert prompts.
- Do not use copyrighted modern character designs as seed content.
