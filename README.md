# 绘神宇宙 MythCanvas

> **用 AI 重现神话世界**

MythCanvas 是一个以 **神话视觉探索 + AI 个性化创作** 为核心的视觉内容产品。它不是普通壁纸图库，也不是通用 Prompt 生图工具，而是围绕 **神话文明 → 神域 → 角色 → 场景 → Artwork** 构建可持续扩展的视觉宇宙。

## 产品方向

用户核心路径：

```text
发现神话视觉
  → 探索角色 / 神域
  → 下载 / 收藏壁纸
  → AI 重绘自己的版本
  → 沉淀“我的宇宙”
```

首发内容覆盖中国、希腊、北欧、日本、埃及神话；后续逐步扩展更多文明、公版文学与开放神话题材。

完整产品与 UX 规范见 [`docs/PRODUCT.md`](./docs/PRODUCT.md)。

## 视觉系统

MythCanvas 全站只维护一套结构与组件体系：

- **Light：天宫鎏金** —— 月白、云海、玉石、仙宫、鎏金；轻、仙、净、贵、梦幻。
- **Dark：月渺仙阙** —— 玄青、月华、星海、夜云、灯火仙阙；夜、月、云、星、静、贵。

主题切换只改变 Semantic Design Token、阴影、光晕与 Art Direction，不改变页面 IA、Grid、Typography Metric 和组件几何结构。

内容层另有两级视觉系统：

1. **Civilization Visual DNA**：不同神话文明保留自己的文化识别元素；
2. **Style Variant**：同一角色和世界支持 Cinematic、Anime、Sacred、Cyber Myth、Ink 等多种画风。

原则：**文化决定“是谁”，画风决定“怎么画”，主题决定“怎么展示”。**

## 当前工程状态

第一阶段产品前台骨架已经落地：

- ✅ Astro 5 + TypeScript + Cloudflare Workers
- ✅ Semantic Design Token
- ✅ Light「天宫鎏金」/ Dark「月渺仙阙」双主题
- ✅ 首屏 no-flash Theme bootstrap + 用户主题记忆
- ✅ MythCanvas Header / Footer / BaseLayout
- ✅ Home 首页
- ✅ Explore 可组合文明 / 类型 / 画风筛选
- ✅ Mythology / Realm / Character / Artwork 类型模型
- ✅ 5 个首发文明的 MVP seed data + Civilization Visual DNA
- ✅ Mythology / Realm / Character / Wallpaper 静态实体详情路由
- ✅ Canonical Design / Style Variant 产品表达
- ✅ AI「绘神」Guided Creator 交互原型
- ✅ 手机壁纸 Device Preview 原型
- ✅ CI Astro build verification
- ✅ 移除 Astro Starter 的 About / Blog / RSS 路由

当前仍属于 **前端产品原型 + typed seed data** 阶段。下一阶段重点是把原型资产和交互接入真实数据与 AI 服务。

尚未完成：

- D1 元数据持久化
- R2 高清图 / 缩略图 / 多尺寸派生图
- Workers AI generation orchestration
- 内容审核
- 用户登录、收藏与“我的宇宙”
- Search / Recommendation service
- 正式神话视觉资产替换 prototype placeholder
- Image Sitemap / JSON-LD / GEO 完整化

## 当前结构

```text
mythcanvas/
├── AGENTS.md
├── agent.md
├── docs/
│   ├── PRODUCT.md
│   └── ARCHITECTURE.md
├── .agents/skills/
│   ├── mythcanvas-product-ux/SKILL.md
│   ├── mythcanvas-astro-cloudflare/SKILL.md
│   ├── mythcanvas-content-model/SKILL.md
│   └── mythcanvas-seo-geo/SKILL.md
├── public/
│   └── art/
│       ├── chinese-celestial.svg
│       └── chinese-celestial-night.svg
├── src/
│   ├── components/
│   │   ├── ui/ThemeToggle.astro
│   │   ├── artwork/ArtworkCard.astro
│   │   ├── character/CharacterCard.astro
│   │   ├── mythology/MythologyCard.astro
│   │   └── realm/RealmCard.astro
│   ├── data/seed.ts
│   ├── layouts/BaseLayout.astro
│   ├── lib/content/
│   │   ├── types.ts
│   │   └── queries.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── explore/index.astro
│   │   ├── mythology/[slug].astro
│   │   ├── realm/[slug].astro
│   │   ├── character/[slug].astro
│   │   ├── wallpaper/[slug].astro
│   │   └── create/index.astro
│   └── styles/
│       ├── tokens.css
│       ├── theme-light.css
│       ├── theme-dark.css
│       ├── typography.css
│       └── global.css
└── wrangler.json
```

详细工程分层与迁移顺序见 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。

## AI 开发约定

任何 AI Agent 开始开发前：

1. 阅读 [`AGENTS.md`](./AGENTS.md)。
2. 根据任务加载 `.agents/skills/` 下对应 Skill。
3. UI 任务必须遵循 Light / Dark 双主题和 Civilization Visual DNA。
4. 核心页面优先 Astro SSR/SSG；仅在交互复杂时引入 Island。
5. 核心 SEO 内容必须存在于服务端输出 HTML，不依赖客户端渲染。
6. 不直接复刻现代动漫、游戏或影视 IP 的具体角色设计。

## Tech Stack

- **Frontend**: Astro 5, TypeScript
- **Runtime**: Cloudflare Workers
- **Content now**: typed MVP seed data
- **Content later**: D1 + editorial Content Collections
- **Storage planned**: Cloudflare R2
- **Cache/config planned**: Cloudflare KV
- **Interactive islands**: vanilla JS first; React only where interaction complexity justifies it

## Commands

```bash
npm install
npm run dev
npm run build
npm run check
npm run preview
npm run deploy
```

Node.js >= 22。

## Development Priorities

已完成：

1. ✅ Semantic Design Token + Light/Dark Theme
2. ✅ Header / Footer / BaseLayout
3. ✅ Home + Explore
4. ✅ Mythology / Realm / Character 领域模型与详情页
5. ✅ Artwork / Wallpaper 详情与 Device Preview 原型
6. ✅ AI「绘神」Guided Creator UX 原型

下一阶段：

7. **P0** 正式视觉资产体系 + R2 Image Pipeline
8. **P0** D1 schema + seed migration
9. **P0** Workers AI generation orchestration + moderation
10. **P1** Search / Related Content / Recommendation
11. **P1** 收藏 / 我的宇宙 / Auth
12. **P1** SEO / GEO / JSON-LD / Image Sitemap
13. **P2** 动态壁纸、分享卡、创作者投稿

## License & Content Policy

神话、民间传说与公版文学中的原始角色/世界观可以作为创作母题，但现代影视、动漫、游戏的具体视觉设计仍可能受版权、商标等权利保护。

MythCanvas 平台内容原则：

- 使用神话原型，重新设计视觉表达；
- 不直接搬运影视截图、游戏卡图、动漫截图或未知版权壁纸；
- 为 Artwork 保留来源、创作者、AI 模型、Prompt metadata、License 与审核状态；
- Canonical Design 应形成 MythCanvas 自有视觉资产。
