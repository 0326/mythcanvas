# MythCanvas 角色列表 + 角色详情页重构计划

> 状态：Ready for Implementation  
> 范围：`/character/` + `/character/{slug}/`  
> 目标：将角色前台从早期 MVP 资料页升级为与现有 Character Variant / Style / OutputSpec 体系一致的正式产品体验。

---

# 0. 重构结论

本次不是局部 CSS 优化，而是角色模块完整重构。

当前前台仍以“角色资料卡 + 伪造多画风壁纸”的 MVP 方式展示，而底层已经具备：

- Character Canonical Design
- Character Variant：age / costume / form / composite
- Style：Canonical / Cinematic / Sacred / Anime / Dark Fantasy / Cyber Myth
- OutputSpec：Desktop / Mobile
- Reference Pack / Reference Assets
- Artwork

本次必须让前台重新对齐这套产品模型。

核心原则：

> **角色决定是谁，Variant 决定角色处于什么长期形态，Style 决定怎么画，OutputSpec 决定为哪个设备构图。**

禁止继续把 Variant 和 Style 混为一类。

---

# 1. 本次目标

## 1.1 角色列表页目标

角色页从“资料卡列表”升级为“神话角色视觉画廊”。

用户进入 `/character/` 后应快速完成：

1. 看到高质量大幅角色肖像；
2. 按文明筛选角色；
3. 搜索角色；
4. 进入感兴趣的角色详情；
5. 感知不同角色属于同一个 MythCanvas 世界体系，而不是独立资料条目。

视觉原则：

> **80% 图片，20% 信息。**

## 1.2 角色详情页目标

角色详情页从“角色介绍 + Style 小卡 + 大量重复壁纸”升级为“角色视觉资产主页”。

核心路径：

```text
角色视觉 Hero
  → 了解角色身份
  → 选择 Character Variant
  → 选择 Style
  → 浏览真实作品
  → 进入神域 / 相关角色
  → 带上下文进入 AI 绘神
```

页面必须突出：

- Canonical identity
- Character Variant
- Rendering Style
- Real Artwork
- Related Realm
- Related Characters
- Create Entry

---

# 2. 当前必须解决的问题

## P0-1：删除 Synthetic Wallpaper 假数据逻辑

当前 `src/pages/character/[slug].astro` 会：

- 为每种 Style 强制构造固定数量壁纸；
- PC 默认 3 张；
- Mobile 默认 5 张；
- 没有真实 Artwork 时复用 Character Portrait / Realm / Mythology Image；
- 同一张图通过 CSS `filter` 模拟 Sacred / Dark / Cyber / Anime 等画风。

这是本次第一优先级删除项。

### 新规则

角色页只允许展示真实 Artwork。

```text
Character
  → getArtworksForCharacter()
  → reviewStatus = approved
  → 按真实 styleId / device 显示
```

没有真实作品就显示真实 Empty State：

```text
暂无「赛博神话」作品
[生成第一张]
```

禁止为了填满 Grid 复制图片。

禁止使用 CSS 色相、亮度、饱和度变化冒充不同 Style Artwork。

---

## P0-2：Variant 能力必须进入 Public Character Page

数据库已存在：

```text
character_variants
- age
- costume
- form
- composite
```

当前公开 Character Repository 和 Character Detail Page 没有使用这些数据。

本次新增 Public Repository：

```text
getCharacterVariants(db, characterId)
getCharacterVariantBySlug(db, characterId, slug)
```

只读取：

```text
status = active
```

前台 Variant 与 Style 必须完全分离。

示例：

```text
嫦娥

形态 Variant
[经典形态] [少女月姬] [月宫礼服] [月神战装]

艺术风格 Style
[经典神话] [电影感] [神圣] [动漫] [暗黑幻想] [赛博神话]
```

允许组合：

```text
月宫礼服 × 神圣
月宫礼服 × Anime
月神战装 × Cyber Myth
```

---

## P0-3：修复角色模块移动端

当前全局使用：

```css
--site-min-width: 1080px;
```

并且 HTML / Body / Character Page 均存在 min-width 约束。

这会导致真实移动端横向溢出。

本次至少保证角色模块在：

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1440px+

均可正常使用。

如果全站暂时无法一次移除 `--site-min-width`，角色模块需要先解除自身强制最小宽度；更推荐同步将全局基础改为真正响应式，并回归验证其他页面。

---

# 3. `/character/` 角色列表页重构

## 3.1 页面 IA

目标结构：

```text
Header

Characters Hero
  eyebrow: Characters
  H1: 诸神有形
  简短介绍

Filter Toolbar
  [全部] [中国] [希腊] [北欧] [日本] [埃及]
  Search Character

Character Gallery
  4 / 5 columns desktop
  2 columns tablet
  2 columns mobile where possible

Explore CTA
```

不需要大面积复杂 Hero。

角色视觉本身就是页面主内容。

---

## 3.2 Character Card 重构

当前横向：

```text
150px portrait + 大量文字
```

改为纵向视觉卡。

推荐结构：

```text
┌──────────────────┐
│                  │
│                  │
│  Character       │
│  Portrait        │
│  3:4 / 4:5       │
│                  │
│                  │
├──────────────────┤
│ 中国神话          │
│ 嫦娥              │
│ Chang'e           │
│ 月宫仙子           │
└──────────────────┘
```

卡片默认只显示：

- Portrait
- Mythology
- Name
- Name EN
- Role

不要显示：

- 长 Summary
- 4 个 Symbols
- Canonical Anchors
- 大量 badge

这些属于 Detail Page。

### Hover / Focus

只做轻量效果：

- 图片 scale 1.02～1.04
- 边框 / 阴影轻微加强
- 可出现“进入角色 →”

禁止：

- 大幅飞入动画
- 多层发光
- 复杂粒子
- 卡片信息覆盖人物脸部

---

## 3.3 Grid

建议：

```css
>= 1500px: 5 columns
1200-1499: 4 columns
768-1199: 3 columns
<768: 2 columns
<=360: 1-2 columns based on minimum card width
```

优先保证人物图足够大。

---

## 3.4 文明筛选

需要同时获取 Mythology，用 `character.mythologyId` 映射。

筛选维度第一版只保留：

- 全部
- 中国神话
- 希腊神话
- 北欧神话
- 日本神话
- 埃及神话

不要首版增加：

- 性别
- 神职
- 阵营
- Style
- Realm
- Variant

避免角色列表页再次变复杂。

筛选状态建议 URL 化：

```text
/character/?mythology=chinese
```

支持 SSR 初始状态 + 前端即时过滤均可。

---

## 3.5 搜索

第一版搜索：

- 中文名
- 英文名
- Role

建议 query：

```text
/character/?q=嫦娥
```

与 mythology 参数可组合。

空状态：

```text
没有找到对应角色
尝试切换神话体系或搜索其他名称。
```

---

# 4. `/character/{slug}/` 详情页重构

最终页面顺序：

```text
1. Immersive Character Hero
2. Character Forms / Variant + Style
3. Real Wallpapers / Artwork
4. Character DNA / Facts
5. Related Realm
6. Related Characters
7. AI Recreate CTA
```

---

# 5. Section 1：Character Hero

## 5.1 目标

第一屏必须首先让用户“看角色”，而不是读 UI。

当前 Hero 同时堆叠：

- Name
- Summary
- Symbols
- CTA
- Style Rail
- 6 个 Style Preview

信息过多。

### 新 Hero

Desktop 推荐：

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│       大幅角色视觉                中国神话          │
│                                  月宫仙子          │
│                                  嫦 娥             │
│                                  Chang'e           │
│                                                    │
│                                  清冷、空灵        │
│                                  月轮 / 玉兔       │
│                                                    │
│                         [查看作品] [绘制我的嫦娥]  │
│                                                    │
└────────────────────────────────────────────────────┘
```

角色图占视觉面积 55%～65%。

### Hero 保留信息

- Mythology
- Role
- Name
- Name EN
- 2～4 个 Identity Symbols
- 一句短 Summary
- CTA：查看作品
- CTA：绘制我的角色

### Hero 移除

- Style Preview Grid
- 大段 Canonical Design
- 重复 Filter

Variant / Style 移到下一 Section。

---

# 6. Section 2：Character Forms

这是本次角色详情页核心模块。

Section Title：

```text
Visual Forms
角色形态
```

## 6.1 第一层：Variant

Variant 表达“这个角色处于什么持续形态”。

示例：

```text
角色形态
[经典] [少女月姬] [月宫礼服] [月神战装]
```

默认：

```text
variant = canonical
```

Canonical 不一定需要数据库 row，可作为虚拟默认项。

Variant Card 推荐：

- 预览图（有 reference asset 时使用）
- Variant Name
- Variant Type
- 一句 description

如果暂无专属图，可以先使用 Character Portrait，但必须明确这是“形态配置”，不能假装成已生成 Artwork。

---

## 6.2 第二层：Style

Style 表达 Rendering Style。

使用真实 Style Repository 数据，优先统一现有 Style ID：

```text
canonical
cinematic
sacred
anime
dark-fantasy
cyber-myth
```

不要在 UI 中继续使用独立的：

```text
warrior
```

如果“战神 / 战斗”是角色状态，应迁移为 Character Variant。

Style UI：

```text
艺术风格
[经典神话] [电影感] [神圣] [动漫] [暗黑幻想] [赛博神话]
```

Style Card 可以使用 Style Reference Asset；如果没有，则使用纯 UI 卡片或受控示意图。

禁止对角色肖像套 CSS filter 作为 Style Preview。

---

## 6.3 状态模型

URL 推荐：

```text
/character/chang-e/?variant=moon-palace-ceremonial&style=sacred
```

设备筛选不放这一层。

选中 Variant / Style 后：

- 更新 URL；
- 更新作品列表过滤；
- 更新 Create CTA 上下文；
- 不强制整页刷新；
- 支持刷新后恢复状态。

---

# 7. Section 3：真实作品 / Wallpapers

## 7.1 数据原则

只显示：

```text
getArtworksForCharacter(character.id)
```

真实存在的 Artwork。

如果 artwork 暂时没有 variantId，需要先按 Style + Device 展示；未来 Artwork model 增加 variant 关联后再扩展过滤。

---

## 7.2 过滤器

首版只保留：

```text
设备
[全部] [PC] [Mobile]
```

Style 已在上一个 Section 选择，不重复再做一整套 Style Filter Toolbar。

如果当前 Style 没有任何 Artwork：

```text
暂无「神圣」风格的嫦娥作品
[生成第一张]
```

Create CTA 自动带当前：

- characterId
- variantId
- styleId
- outputSpecId（如果用户选择 PC/Mobile）

---

## 7.3 Grid

PC Artwork：

```text
3 columns desktop
2 columns tablet
1 column mobile
```

Mobile Artwork：

```text
4～5 columns large desktop
3 columns normal desktop
2 columns tablet/mobile
```

如果作品数量少，不要通过复制内容撑满。

---

## 7.4 Artwork Card

保持简洁：

- image
- title
- style
- device / ratio

Hover：

```text
查看壁纸 ↗
```

进入 `/wallpaper/{slug}/`。

---

# 8. Section 4：Character DNA / Facts

将当前 Canonical Design 从“普通文字列表”升级为角色视觉档案。

推荐结构：

```text
Character DNA

身份
月宫仙子

所属文明
中国神话

所在神域
三十三重天

核心符号
月轮 / 玉兔 / 桂花 / 飘带

稳定视觉锚点
圆月背光 / 长飘带 / 玉兔 / 玉白与鎏金

核心轮廓
轻盈长衣与环月构成纵向流动轮廓
```

如果 Canonical Design 增加 Signature Materials，继续展示。

此模块同时承担：

- 世界观可信度
- SEO / GEO 实体信息
- 用户理解不同 Style 为什么仍是同一个角色

---

# 9. Section 5：Related Realm

保留当前 Realm Card，但减少重复标题和装饰。

目标：

```text
Character → Realm
```

让用户继续进入世界。

---

# 10. Section 6：Related Characters

当前缺失，必须新增。

## 10.1 MVP 推荐规则

优先顺序：

```text
Same Realm
  > Same Mythology
  > fallback other featured characters
```

排除当前 character。

显示 4～6 个。

使用新的 Character Visual Card，而不是旧横向资料卡。

目标形成：

```text
嫦娥
  → 三十三重天
  → 同文明其他角色
  → 更多作品
```

避免 Character Detail 成为浏览死路。

---

# 11. Section 7：AI Recreate CTA

页面底部保留大型 CTA。

文案建议：

```text
绘制我的嫦娥

保留角色核心身份，选择形态、艺术风格和设备构图，
生成属于你的神话壁纸。

[开始绘神]
```

必须将当前选择上下文带到 `/create/`。

推荐 query：

```text
/create/?character=character-change&variant=variant-change-ceremonial&style=sacred&output=mobile-wallpaper
```

如果 Creator 已有自己的状态协议，复用现有参数规范，不重复造第二套。

---

# 12. 数据层改造

## 12.1 Character Variant Public Types

建议新增：

```ts
export type CharacterVariant = {
  id: string;
  characterId: string;
  slug: string;
  name: string;
  variantType: 'age' | 'costume' | 'form' | 'composite';
  description: string;
  traits: Record<string, unknown>;
  identityOverrides: readonly string[];
  referencePack: readonly string[];
};
```

只暴露 Public UI 真正需要字段。

不要直接将 Admin / Generation DB Row 透传前台。

---

## 12.2 Repository

建议新增：

```text
src/lib/content/repositories/character-variant.ts
```

提供：

```ts
getCharacterVariants(db, characterId)
getCharacterVariantBySlug(db, characterId, slug)
```

并从：

```text
src/lib/content/repositories/index.ts
```

统一 export。

---

## 12.3 Related Characters

可新增：

```ts
getRelatedCharacters(db, character, limit = 6)
```

或者先在 Page 层组合现有：

```text
getCharactersForRealm
getCharactersForMythology
```

避免初版引入复杂推荐系统。

---

# 13. Style 模型收敛

当前同时存在：

```text
character-styles.ts
```

和 D1 `styles`。

长期应以正式 Style Repository / D1 Styles 为单一来源。

本次建议：

1. Detail Page 不再硬编码第二套独立 style definitions；
2. 兼容 legacy ID 时在数据层 normalize；
3. UI 统一显示正式 Style；
4. `warrior` 从 Rendering Style 概念退出；
5. `cinematic` 恢复为正式 Style；
6. `dark` → `dark-fantasy`；
7. `cyber` → `cyber-myth`。

如果当前 Artwork 仍使用 legacy style id，保留 normalize adapter，不要要求一次迁完历史数据。

---

# 14. 组件拆分建议

当前 `src/pages/character/[slug].astro` 过大，页面逻辑、数据生成、脚本、样式全部耦合。

重构后建议：

```text
src/components/character/
├── CharacterCard.astro
├── CharacterHero.astro
├── CharacterVariantSelector.astro
├── CharacterStyleSelector.astro
├── CharacterArtworkGrid.astro
├── CharacterDNA.astro
└── RelatedCharacters.astro
```

必要时将交互状态做成一个小型 React / Preact Island；如果 Astro + 少量 DOM script 足够，不要为了状态管理把整个页面 SPA 化。

原则：

> SSR 主内容 + Progressive Enhancement。

SEO 关键内容不能依赖纯客户端请求后才出现。

---

# 15. CSS / Design 规则

## 15.1 保持现有品牌主题

继续使用：

- Light：天宫鎏金
- Dark：月渺仙阙
- Semantic Tokens
- Source Han Serif / LXGW WenKai 既有字体规则

本次不重做全站主题。

---

## 15.2 角色图优先

角色页面视觉优先级：

```text
Character Portrait
> Artwork
> Name
> Metadata
> UI Chrome
```

UI 不应该和角色图竞争视觉注意力。

---

## 15.3 禁止事项

角色模块禁止：

- 大量小标签堆积
- Emoji 作为主要 UI Icon
- CSS Filter 冒充 Style
- 复制 Artwork 填满 Grid
- 大面积玻璃拟态卡片叠卡片
- 所有 Section 都使用 Surface Box
- 每个区域都发光
- 超重渐变边框
- 长文本覆盖人物图

---

# 16. 响应式设计

## Desktop >= 1200

Character Index：4～5 列。

Character Detail Hero：左右双栏，人物图为视觉主角。

Forms：Variant / Style 横向展示。

Artwork：多列 Grid。

---

## Tablet 768～1199

Character Index：3 列。

Character Detail Hero：人物图 + 文案可保持双栏，但降低文案宽度。

Forms：允许横向滚动或 2～3 列。

---

## Mobile < 768

推荐顺序：

```text
Character Image
Name / Role
CTA
Identity Symbols

Variant
Style

Artwork
Character DNA
Realm
Related Character
AI CTA
```

Hero 不允许强制 `100svh` 导致文字被挤出首屏。

Filter / Selector 可横向滚动，但：

- 不隐藏选中项；
- 有明显 active state；
- touch target >= 44px。

---

# 17. SEO / GEO

角色详情页继续保留：

```text
Thing JSON-LD
BreadcrumbList
```

同时保证 SSR HTML 内明确包含：

- 中文名
- 英文名
- Role
- Mythology
- Realm
- Symbols
- Canonical Anchors
- Related Realm
- Related Characters

核心人物图使用真实 `<img>`，必须：

- alt
- width
- height
- loading 策略

Hero 图使用 `fetchpriority=high`。

列表卡片图片 lazy load。

---

# 18. 性能

## Character Index

避免一次请求大图原图。

若现有媒体系统支持 thumbnail / transformed image，应优先使用列表缩略图。

否则至少：

- 固定 width / height
- lazy loading
- decoding=async

---

## Detail

Hero 只 preload / high priority 1 张核心图。

Variant / Style Preview / Related Characters 全部 lazy。

禁止首屏加载所有 Style × Device Artwork。

---

# 19. Accessibility

必须保证：

- Character Card 有清晰 accessible name；
- Variant / Style 有 `aria-pressed` 或 radio semantics；
- Filter 不仅依赖颜色表达 active；
- Keyboard 可操作；
- Focus Visible；
- Reduced Motion；
- 图片 alt；
- Touch target >= 44px。

---

# 20. 推荐实施阶段

## Phase 1：数据与假数据清理

优先完成：

- [ ] 新增 CharacterVariant Public Type
- [ ] 新增 Character Variant Repository
- [ ] Detail Page 查询 Variant
- [ ] 删除 Synthetic Wallpaper Entry 构造逻辑
- [ ] 删除 Style CSS filter 模拟
- [ ] Artwork 只显示真实内容
- [ ] 统一 Style ID / normalize 逻辑

完成标准：

> 页面不再展示任何“实际上不存在”的 Artwork。

---

## Phase 2：Character Index 重构

- [ ] 重写 CharacterCard
- [ ] 纵向人物卡
- [ ] 新 Character Gallery Grid
- [ ] Mythology Filter
- [ ] Search
- [ ] URL State
- [ ] Empty State
- [ ] Mobile Responsive

完成标准：

> `/character/` 第一眼是人物视觉画廊，不是资料列表。

---

## Phase 3：Character Detail Hero + Forms

- [ ] 拆 CharacterHero
- [ ] Hero 移除 Style Rail
- [ ] 新 Variant Selector
- [ ] 新 Style Selector
- [ ] Variant / Style URL State
- [ ] Create CTA 继承上下文
- [ ] Responsive

完成标准：

> 用户可以明确理解“角色形态”和“艺术画风”是两个独立选择。

---

## Phase 4：Artwork + DNA + Related

- [ ] CharacterArtworkGrid
- [ ] PC / Mobile Filter
- [ ] Real Empty State
- [ ] Character DNA
- [ ] Related Realm
- [ ] Related Characters
- [ ] AI Recreate CTA

完成标准：

> 页面形成 Character → Artwork / Realm / Character / Create 多条继续探索链路。

---

## Phase 5：回归与视觉精修

- [ ] Light Theme
- [ ] Dark Theme
- [ ] 320 / 375 / 430 / 768 / 1024 / 1440 viewport
- [ ] Keyboard
- [ ] Reduced Motion
- [ ] Build / Typecheck / Tests
- [ ] SEO structured data
- [ ] Performance regression

此阶段才允许增加：

- subtle image crossfade
- restrained ambient glow
- light hover motion
- Civilization-specific local motifs

不要在 Phase 1～4 之前先做动效。

---

# 21. 建议修改文件

预计主要涉及：

```text
src/pages/character/index.astro
src/pages/character/[slug].astro

src/components/character/CharacterCard.astro
src/components/character/CharacterHero.astro
src/components/character/CharacterVariantSelector.astro
src/components/character/CharacterStyleSelector.astro
src/components/character/CharacterArtworkGrid.astro
src/components/character/CharacterDNA.astro
src/components/character/RelatedCharacters.astro

src/lib/content/types.ts
src/lib/content/repositories/index.ts
src/lib/content/repositories/character.ts
src/lib/content/repositories/character-variant.ts
src/lib/content/character-styles.ts   // 收敛 / 兼容层

src/styles/global.css                 // 响应式基础按需调整
src/styles/tokens.css                 // site-min-width 按需清理
```

如果已有 Creator URL state helper，应直接复用，不新建重复协议。

---

# 22. 非目标

本次不做：

- 新增 30～40 个完整角色内容；
- 批量生成所有 Variant × Style Artwork；
- 推荐算法；
- 社区；
- 评论；
- 复杂用户画像；
- 角色关系图谱；
- 全站视觉重构；
- Admin Character Studio 重构。

这次只解决 Public Character Experience。

---

# 23. 最终验收标准

## Character Index

- [ ] 角色卡以人物大图为视觉主体
- [ ] 桌面至少 4 列，宽屏可 5 列
- [ ] 支持 Mythology 筛选
- [ ] 支持角色搜索
- [ ] 移动端无横向溢出
- [ ] 卡片不再展示大段 Summary / Symbols

## Character Detail

- [ ] Hero 不再包含 6 个 Style 小卡
- [ ] Variant 和 Style 是两个独立模块
- [ ] `warrior` 不再作为正式 Rendering Style 展示
- [ ] 真实 Artwork 才会进入壁纸列表
- [ ] 不复制同一张图填充数量
- [ ] 不通过 CSS filter 冒充不同画风
- [ ] 无作品时使用真实 Empty State
- [ ] Character DNA 明确展示身份锚点
- [ ] 有 Related Realm
- [ ] 有 Related Characters
- [ ] Create CTA 带 Character / Variant / Style / Output 上下文
- [ ] 320px 起可正常使用

## Engineering

- [ ] `npm run build` / 项目现有 build script 通过
- [ ] typecheck 通过
- [ ] 现有 tests 通过
- [ ] 无新增 console error
- [ ] SEO Structured Data 未回退
- [ ] Light / Dark 均通过视觉检查

---

# 24. 最终产品效果判断

重构完成后，用户对两个页面的理解应非常明确：

```text
Explore
= 找作品

Characters
= 找喜欢的角色

Character Detail
= 深入一个角色的视觉宇宙

Create
= 基于角色 + Variant + Style + OutputSpec 创造自己的版本
```

如果 Character Detail 仍然给人“图库筛选页”的感觉，则说明重构没有完成。

最终判断标准不是组件是否更精致，而是：

> **角色是否真正成为 MythCanvas 的长期视觉资产与探索入口。**
