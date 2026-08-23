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
2. **Style Variant**：同一角色和神域支持 Cinematic、Anime、Sacred、Cyber Myth、Ink 等多种画风。

原则：**文化决定“是谁”，画风决定“怎么画”，主题决定“怎么展示”。**

## 当前工程状态

产品前台与第一版后端边界已经落地：

- ✅ Astro 5 + TypeScript + Cloudflare Workers
- ✅ Semantic Design Token
- ✅ Light「天宫鎏金」/ Dark「月渺仙阙」双主题
- ✅ 首屏 no-flash Theme bootstrap + 用户主题记忆
- ✅ MythCanvas Header / Footer / BaseLayout
- ✅ Home + Explore
- ✅ Mythology / World / Character / Artwork 类型模型
- ✅ 5 个首发文明的 MVP seed data + Civilization Visual DNA
- ✅ Mythology / World / Character / Wallpaper 实体详情路由
- ✅ Canonical Design / Style Variant 产品表达
- ✅ AI「绘神」Guided Creator
- ✅ Device Preview
- ✅ D1 schema + core seed migrations
- ✅ `/api/generate` Workers orchestration
- ✅ Provider-neutral Image Provider adapter
- ✅ Mock Provider，用于零成本端到端开发和 CI
- ✅ 可选 HTTP Image Provider
- ✅ R2 generated artwork persistence adapter
- ✅ `/media/*` R2 delivery route
- ✅ generation job D1 persistence / status API
- ✅ CI Astro build verification

当前默认仍使用 **Mock Provider + typed seed content**，因此不需要 D1/R2/模型服务也能运行完整 Creator 流程。配置正式 Cloudflare binding 与图片模型 Provider 后，同一套链路会自动切换为持久化真实生成结果。

Cloudflare 接入见 [`docs/CLOUDFLARE_SETUP.md`](./docs/CLOUDFLARE_SETUP.md)。

## 当前结构

```text
mythcanvas/
├── AGENTS.md
├── agent.md
├── migrations/
│   ├── 0001_initial.sql
│   └── 0002_seed_core.sql
├── docs/
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   └── CLOUDFLARE_SETUP.md
├── .agents/skills/
│   ├── mythcanvas-product-ux/SKILL.md
│   ├── mythcanvas-astro-cloudflare/SKILL.md
│   ├── mythcanvas-content-model/SKILL.md
│   └── mythcanvas-seo-geo/SKILL.md
├── public/
│   └── art/
├── src/
│   ├── components/
│   ├── data/seed.ts
│   ├── layouts/BaseLayout.astro
│   ├── lib/
│   │   ├── content/
│   │   ├── cloudflare/
│   │   │   ├── assets.ts
│   │   │   └── generation-repository.ts
│   │   └── generation/
│   │       ├── types.ts
│   │       ├── validation.ts
│   │       ├── prompt.ts
│   │       ├── provider.ts
│   │       └── service.ts
│   ├── pages/
│   │   ├── api/
│   │   ├── media/
│   │   ├── create/
│   │   ├── explore/
│   │   ├── mythology/
│   │   ├── world/
│   │   ├── character/
│   │   └── wallpaper/
│   └── styles/
└── wrangler.json
```

详细工程分层与迁移顺序见 [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)。

## AI「绘神」生成链路

```text
Creator UI
  → POST /api/generate
  → validate guided request
  → resolve Civilization Visual DNA
  → resolve Character / World Canonical Design
  → compose provider-neutral prompt
  → Image Provider adapter
  → persist image to R2 when available
  → persist generation job to D1 when available
  → return normalized result
```

浏览器永远不直接持有模型服务密钥。

当前 Provider 模式：

- `mock`：默认，输出 MythCanvas SVG 预览，完整走 API / D1 / R2 边界；
- `http`：连接任意符合 MythCanvas HTTP Image Provider contract 的模型网关。

## AI 开发约定

任何 AI Agent 开始开发前：

1. 阅读 [`AGENTS.md`](./AGENTS.md)。
2. 根据任务加载 `.agents/skills/` 下对应 Skill。
3. UI 任务必须遵循 Light / Dark 双主题和 Civilization Visual DNA。
4. 核心页面优先 Astro SSR/SSG；仅在交互复杂时引入 Island。
5. 核心 SEO 内容必须存在于服务端输出 HTML，不依赖客户端渲染。
6. 不直接复刻现代动漫、游戏或影视 IP 的具体角色设计。
7. 浏览器不得直接调用需要 Secret 的 AI Provider。

## Tech Stack

- **Frontend**: Astro 5, TypeScript
- **Runtime**: Cloudflare Workers
- **Content now**: typed MVP seed data
- **Database**: Cloudflare D1 schema ready, binding optional
- **Storage**: Cloudflare R2 adapter ready, binding optional
- **Generation**: provider-neutral Worker orchestration
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
4. ✅ Mythology / World / Character 领域模型与详情页
5. ✅ Artwork / Wallpaper 详情与 Device Preview
6. ✅ AI「绘神」Guided Creator
7. ✅ D1 schema + seed migration
8. ✅ R2 generated artwork boundary
9. ✅ Workers generation orchestration + mock/http provider adapter

下一阶段：

10. **P0** 创建真实 D1/R2 资源并完成生产 binding
11. **P0** 接入正式图片生成 Provider + moderation / quota / rate limit
12. **P0** 将正式 Artwork 内容读取从 seed 迁移到 D1/R2
13. **P1** Search / Related Content / Recommendation
14. **P1** 收藏 / 我的宇宙 / Auth
15. **P1** SEO / GEO / JSON-LD / Image Sitemap
16. **P2** 动态壁纸、分享卡、创作者投稿

## License & Content Policy

神话、民间传说与公版文学中的原始角色/世界观可以作为创作母题，但现代影视、动漫、游戏的具体视觉设计仍可能受版权、商标等权利保护。

MythCanvas 平台内容原则：

- 使用神话原型，重新设计视觉表达；
- 不直接搬运影视截图、游戏卡图、动漫截图或未知版权壁纸；
- 为 Artwork 保留来源、创作者、AI 模型、Prompt metadata、License 与审核状态；
- Canonical Design 应形成 MythCanvas 自有视觉资产；
- Provider Prompt 会明确要求避免复刻现代商业 IP 的具体视觉设计。
