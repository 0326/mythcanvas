# MythCanvas 日本神话完整补全方案

> 状态：Review Proposal  
> 版本：V1.0  
> 日期：2026-09-01  
> 适用范围：日本神话内容建模、神代人物扩充、神谱关系、World / Scene、Story、来源体系、视觉资产、Character Detail / Graph、结构化内容流水线与后续 AI 出图。  
> 相关文档：`docs/NORSE_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/GREEK_MYTHOLOGY_COMPLETION_PLAN.md`、`docs/NORSE_CHARACTER_DETAIL_GRAPH_INTEGRATION_PLAN.md`、`docs/CONTENT_POSITIONING.md`、`docs/CHARACTER_ART_SYSTEM.md`、`.agents/skills/mythcanvas-content-model/SKILL.md`

---

## 0. 结论

当前日本神话已经具备首发骨架，但还没有形成一套真正可连续理解、可追溯来源、可支撑角色关系图与批量视觉生产的“日本神话内容宇宙”。

仓库当前已有：

- `myth-japanese`；
- `world-takamagahara` / 高天原；
- `character-kaguya` / 辉夜姬；
- 3 篇日本相关 Story：
  - 伊邪那岐与伊邪那美；
  - 天照大神隐入天岩户；
  - 辉夜姬归月；
- 日本文明的基础 Visual DNA；
- 通用 Character / Relation / Interpretation / Variant / World / Scene / Story Schema；
- 希腊阶段已经落地的 Structured Content Pipeline；
- 北欧方案已经提出的跨文明通用 Pipeline、来源化 Graph 与 Character Detail 集成方向。

但当前内容结构实际更接近：

```text
日本神话
  → 高天原
  → 辉夜姬
  → 伊邪那岐 / 伊邪那美 Story
  → 天岩户 Story
  → 辉夜姬 Story
```

这存在两个根本问题：

1. **神代主干缺失**：国生、神生、黄泉、禊祓、三贵子、须佐之男、八岐大蛇、大国主、国让、天孙降临、海幸山幸等关键闭环尚未结构化。
2. **辉夜姬定位错误**：辉夜姬来自《竹取物语》的古典物语传统，不属于《古事记》《日本书纪》的高天原神系。她可以继续属于 `myth-japanese`，但必须迁移到“古典传说 / 物语层”，不能作为高天原核心角色，也不应继续绑定 `world-takamagahara`。

完整目标应变成：

```text
日本神话
  → 天地初成与别天津神
  → 伊邪那岐 / 伊邪那美与国生、神生
  → 黄泉与禊祓
  → 天照 / 月读 / 须佐之男
  → 高天原冲突与天岩户
  → 须佐之男降临出云、八岐大蛇
  → 大国主与出云神话循环
  → 葦原中国平定与国让
  → 天孙降临
  → 木花咲耶姬与山海神话
  → 海幸山幸与神代主线收束
  → 古典传说层：辉夜姬等后世传统
  → Story 驱动的 Character / World / Scene / Relation 闭包
  → 记纪版本差异可追溯
  → 可用于 Character Graph 与 AI 出图的文化视觉体系
```

### 本方案的五个核心决策

1. **Story First**：先锁定 P0 神代 Story Manifest，再通过依赖闭包反推 Character / World / Scene / Relation，不按“日本神明大全”灌名单。
2. **记纪双源、Claim-level Source**：`Kojiki / 古事记` 与 `Nihon Shoki / 日本书纪` 是 P0 主来源，但两者在神名、谱系、情节和多个“一书”版本上存在差异，不能压成唯一正史。
3. **神代神话与后世民间传统分层**：神代记纪、风土记地方传统、古典物语、中世神佛习合、江户妖怪/民俗不能混成一个扁平“日本神话”。
4. **纠正视觉上的“旅游日本化”**：当前“鸟居 + 神社 + 月色 + 樱花”只能作为现代识别层，不能成为所有神代内容的默认视觉。高天原、黄泉、出云、天孙降临需要各自独立的 Visual DNA。
5. **不新建 Japanese-only 工具链**：日本是继希腊、北欧之后第三个完整文明，应推动通用 `mythology content registry + validator + importer`，而不是复制 `sync-japanese-content.mjs` 特例。

---

# 1. 当前仓库盘点与需要纠正的问题

## 1.1 当前 Mythology Visual DNA 偏窄

当前日本神话 Visual DNA 主要是：

```text
月白 / 墨青 / 克制朱红
鸟居 / 神社 / 注连绳 / 月
木 / 和纸 / 石
幽玄 / 静谧 / 灵性
```

作为站点首发识别足够，但不足以支撑完整日本神话，且容易造成以下偏差：

- 高天原被画成“山中神社旅游海报”；
- 所有场景都塞红色鸟居；
- 所有女神都穿平安时代十二单；
- 出云、黄泉、海神宫缺乏空间差异；
- 天照、须佐之男、大国主等角色滑向现代动漫 / 游戏既有设计；
- 神代场景出现大量时代不匹配的成熟神社建筑、江户式装饰或现代祭典符号。

本轮必须将日本视觉体系从“日本氛围”升级为“神代叙事空间”。

## 1.2 当前高天原只有一个 World

`world-takamagahara` 可以继续作为核心 World，但不能承载全部日本神话。

Story Dependency Closure 至少会反推出：

- Takamagahara / 高天原；
- Ashihara no Nakatsukuni / 葦原中国；
- Yomi no Kuni / 黄泉国；
- Ne no Katasukuni / 根之坚州国（必须与黄泉区分，不默认合并）；
- Watatsumi no Miya / 海神宫、海神之国；
- Tokoyo no Kuni / 常世国（P1，按 Story 依赖决定是否升级为正式 World）。

Onogoro、天岩户、天安河原、黄泉比良坂、稻佐之滨、高千穗峰等更适合建成 Scene，而不是滥用 World。

## 1.3 辉夜姬必须做“保 URL、改 taxonomy”迁移

现有：

```text
character-kaguya
mythologyId = myth-japanese
worldIds = [world-takamagahara]
```

本轮策略：

- 保留 `character-kaguya`、`slug=kaguya` 和公开 URL；
- 保留 `story-kaguya-return`；
- 从 `world-takamagahara` 解绑；
- 将 tradition / taxonomy 调整为：
  - `classical-tale` / 古典物语；
  - `taketori-monogatari` / 《竹取物语》传统；
- 后续如需扩展“月界”，只能作为《竹取物语》的 narrative world / interpretation world，不得反向解释为高天原；
- 现有“月宫十二单”“月升神相”等 Variant 可继续作为 MythCanvas 视觉解释，但必须明确 `originalDesignChoice / interpretation`，不能被包装成原典设定。

这是日本补全的第一条数据治理任务。

---

# 2. 来源体系与边界

## 2.1 P0 主要来源

### A. 《古事记》上卷 / Kojiki Book I

作为 P0 主线来源之一，覆盖：

- 天地初成；
- 别天津神 / 神世七代；
- 伊邪那岐、伊邪那美；
- 国生 / 神生；
- 火神与伊邪那美之死；
- 黄泉；
- 禊祓与三贵子；
- 天照与须佐之男誓约；
- 天岩户；
- 八岐大蛇；
- 大国主循环；
- 国让；
- 天孙降临；
- 木花咲耶姬；
- 海幸山幸。

### B. 《日本书纪》卷第一、卷第二 / Nihon Shoki Books I-II

与《古事记》共同构成 P0 主干，但必须保存：

- 正文与“一书”异传；
- 神名和亲缘差异；
- 须佐之男出生方式差异；
- 大国主谱系差异；
- 国让执行神祇差异；
- 月读 / 保食神等《古事记》未展开内容。

### C. 《风土记》体系，重点《出云国风土记》

P1 / 局部 P0 补充：

- 出云地区地方神话；
- 地名起源与地方神；
- 与《记纪》不同的地方谱系；
- 国引等强地域故事。

### D. 《古语拾遗》等古代补充文献

用于 P1 source enrichment，不取代《记纪》主干。

## 2.2 后世传统分层

以下内容都可以进入 `myth-japanese`，但必须独立 tradition scope：

```text
classical-myth         记纪神代主干
regional-fudoki        风土记地方传统
classical-tale         平安以前后古典物语，如辉夜姬
medieval-syncretic     中世神佛习合 / 本地垂迹等
folklore               民间传说、地方信仰
edo-yokai              江户以后妖怪图谱传统
modern-popular         现代流行再解释，仅可做 visual interpretation，不做 canonical source
```

P0 只建设 `classical-myth`，辉夜姬作为已存在 legacy content 保留但移入 `classical-tale`。

## 2.3 Claim-level Source Policy

所有以下字段只要存在版本差异，就必须可挂来源：

- parent / child；
- spouse；
- birth / origin；
- ruler / domain；
- weapon / sacred object；
- world / scene involvement；
- Story event；
- alternate names；
- Character Canonical facts；
- Interpretation 的来源范围。

禁止：

```text
Kojiki 说 A
Nihon Shoki 一书说 B
网络百科又说 C
→ 数据库合并成“唯一事实 D”
```

应建成：

```text
Claim A -> sourceScope: kojiki
Claim B -> sourceScope: nihon-shoki-alt-1
Claim C -> 不进入 canonical，除非有可靠文本来源
```

---

# 3. “完整”的定义

日本神话的完整不等于收录“八百万神”或所有神社祭神。

MythCanvas 的 P0 完整定义是：

> 用户可以从天地初成开始，连续理解国生、神生、黄泉、禊祓、三贵子、高天原冲突、天岩户、须佐之男与八岐大蛇、大国主的出云循环、葦原中国平定、国让、天孙降临、木花咲耶姬、海幸山幸；所有关键 Story 的人物、地点、关系和来源不存在悬空依赖。

P0 不要求：

- 收录所有《延喜式》神社祭神；
- 收录所有地方风土神；
- 收录所有妖怪；
- 收录所有中世神佛习合神；
- 收录完整天皇世系；
- 把日本神话做成宗教学百科。

---

# 4. P0 Story Manifest — 30 篇神代主线

P0 先固定 Story Manifest，再执行 dependency closure。

## Volume A：天地初成与国生（7）

1. 天地初成与别天津神
2. 神世七代与伊邪那岐、伊邪那美
3. 天之浮桥与淤能碁吕岛
4. 国生：日本列岛诸岛的诞生
5. 神生：山川草木与诸神
6. 火之神迦具土与伊邪那美之死
7. 伊邪那岐追至黄泉

## Volume B：黄泉、禊祓与三贵子（4）

8. 黄泉之国与腐坏的伊邪那美
9. 黄泉比良坂：生死边界的确立
10. 伊邪那岐禊祓
11. 天照、月读、须佐之男诞生

## Volume C：高天原与天岩户（5）

12. 须佐之男哭泣与放逐命令
13. 天照与须佐之男的誓约
14. 须佐之男大闹高天原
15. 天照隐入天岩户
16. 天宇受卖、思兼与众神迎回太阳

## Volume D：出云与大国主（8）

17. 须佐之男降临出云
18. 八岐大蛇与草薙剑
19. 因幡白兔
20. 大国主与八十神
21. 大国主进入根之坚州国
22. 须势理毗卖与大国主的试炼
23. 大国主与少彦名共同经营国土
24. 少彦名离去与大国主完成国土

## Volume E：葦原中国平定与国让（3）

25. 高天原决定平定葦原中国
26. 使者失败与建御雷降临稻佐之滨
27. 大国主国让、事代主与建御名方

## Volume F：天孙降临与山海神话（3）

28. 邇邇艺降临高千穗、猿田彦引路与天宇受卖
29. 木花咲耶姬、石长比卖与火中生产
30. 海幸山幸、海神宫与丰玉姬

### P0.5 候选 Story

- 月读与保食神（《日本书纪》传统）；
- 天稚彦与雉之故事；
- 大国主与沼河比卖；
- 大物主显现；
- 国引神话（《出云国风土记》）；
- 鹈葺草葺不合命与神武之前的谱系过渡。

### P1 古典传说卷

- 辉夜姬归月（保留已有 Story）；
- 浦岛子 / 浦岛太郎早期传统；
- 常世相关古典传说；
- 其他有明确古典文本来源的物语。

---

# 5. Character Dependency Closure

不预设“必须 40 / 50 个角色”。最终 Character 数量由 30 篇 P0 Story 的依赖闭包决定。

## 5.1 P0 Tier S — 首页级核心角色

首批视觉与 Character Detail 必须优先完成：

1. 伊邪那岐 / Izanagi
2. 伊邪那美 / Izanami
3. 天照大神 / Amaterasu
4. 须佐之男 / Susanoo
5. 月读 / Tsukuyomi
6. 大国主 / Ōkuninushi
7. 建御雷 / Takemikazuchi
8. 邇邇艺 / Ninigi
9. 木花咲耶姬 / Konohanasakuya-hime
10. 天宇受卖 / Ame-no-Uzume
11. 猿田彦 / Sarutahiko
12. 八岐大蛇 / Yamata no Orochi

Tier S 要求：

- Canonical Design 完整；
- Character Detail 内容完整；
- Source Coverage 100%；
- Graph 关键关系完整；
- 至少 1 张 production portrait；
- 至少 1 组 PC / Mobile wallpaper candidate；
- 不依赖现代 IP 视觉设计。

## 5.2 P0 Tier A — Story 闭包关键角色

预计包括但不限于：

- 天之御中主 / Ame-no-Minakanushi；
- 高御产巢日 / Takamimusubi；
- 神产巢日 / Kamimusubi；
- 迦具土 / Kagutsuchi；
- 思兼 / Omoikane；
- 天手力男 / Ame-no-Tajikarao；
- 天儿屋命 / Ame-no-Koyane；
- 布刀玉命 / Futodama；
- 栉名田比卖 / Kushinadahime；
- 足名椎 / Ashinazuchi；
- 手名椎 / Tenazuchi；
- 须势理毗卖 / Suseribime；
- 少彦名 / Sukunahikona；
- 事代主 / Kotoshironushi；
- 建御名方 / Takeminakata；
- 天忍穗耳 / Amenooshihomimi；
- 火远理 / Hoori；
- 火照 / Hoderi；
- 丰玉姬 / Toyotama-hime；
- 海神 / Watatsumi。

最终列表以 Story validator 输出为准。

## 5.3 Character Taxonomy

至少拆分：

```text
characterType
  deity
  primordial-deity
  nature-deity
  culture-deity
  monster
  legendary-person
  divine-ancestor

traditionGroup
  amatsukami
  kunitsukami
  izumo-cycle
  sea-deity
  classical-tale
```

注意：

- `amatsukami / kunitsukami` 是神话语境中的来源/阵营标签，不应与 `characterType` 混在一个枚举；
- 八岐大蛇应为 `monster`，但仍是 Character Entity；
- 辉夜姬应为 `legendary-person + classical-tale`，不是 `deity / amatsukami`。

---

# 6. Relation / Character Graph 规则

日本神话非常适合 Graph，但也非常容易因版本差异制造“伪确定关系”。

## 6.1 必须支持 traditionScope

例如：

- 须佐之男的出生方式；
- 大国主与须佐之男的世代关系；
- 国让执行神是建御雷、经津主还是共同出现；
- 某些神的配偶与子嗣；
- 月读与保食神事件。

Graph API 不应只返回一套扁平边。

每条关系至少应支持：

```ts
{
  sourceRefs: [...],
  traditionScope: 'kojiki' | 'nihon-shoki-main' | 'nihon-shoki-alt-*' | 'izumo-fudoki',
  isDefault: boolean,
  confidence: 'direct' | 'editorial-normalized' | 'interpretive',
}
```

## 6.2 默认图谱策略

默认图谱只显示：

1. 多个核心来源一致的关系；或
2. 编辑团队明确选定、并标注来源的主版本关系。

切换 tradition 后显示差异边。

禁止为了让图谱“看起来完整”而把互斥版本同时画成无说明的事实。

## 6.3 Graph 需要优先覆盖的关系组

- 伊邪那岐 ↔ 伊邪那美；
- 三贵子；
- 天照 / 须佐之男誓约所生神；
- 须佐之男 → 出云谱系；
- 大国主配偶 / 子嗣中与 P0 Story 有关的部分；
- 天照 → 天忍穗耳 → 邇邇艺；
- 邇邇艺 ↔ 木花咲耶姬；
- 火照 / 火远理；
- 火远理 ↔ 丰玉姬。

---

# 7. World / Scene 建模

## 7.1 P0 World

### `world-takamagahara` — 高天原

保留现有 ID / slug，但更新：

- summary；
- Canonical Design；
- hero；
- Visual DNA；
- 关联 Character；
- Scene。

禁止默认设计为“成熟神社建筑群”。应更多依赖：

- 云上原野；
- 神圣织殿 / 高天原议场等叙事元素；
- 天安河；
- 神木、镜、玉、神圣绳等 Story 级 symbol；
- 远古、开放、非旅游景区化的空间。

### `world-ashihara-no-nakatsukuni` — 葦原中国

承载地上世界的神话主线：

- 出云；
- 稻佐之滨；
- 人间山野、芦原、海岸；
- 国让与天孙降临之前的地上秩序。

### `world-yomi` — 黄泉国

核心视觉：

- 封闭、腐朽、黑暗；
- 黄泉比良坂作为边界 Scene；
- 不直接套用佛教地狱视觉。

### `world-ne-no-katasukuni` — 根之坚州国

用于大国主试炼。

必须与黄泉保持可区分的 source semantics；是否视觉上部分共享可后续设计，但数据上不先合并。

### `world-watatsumi-palace` — 海神宫 / 海神之国

用于海幸山幸、丰玉姬。

视觉不能直接复制中国龙宫，应建立日本神代海洋语汇。

## 7.2 P0 Scene

建议至少包括：

- `scene-ame-no-ukihashi` / 天之浮桥；
- `scene-onogoro-island` / 淤能碁吕岛；
- `scene-yomotsu-hirasaka` / 黄泉比良坂；
- `scene-misogi-shore` / 禊祓之滨；
- `scene-ame-no-yasukawara` / 天安河原；
- `scene-ama-no-iwato` / 天岩户；
- `scene-hii-river` / 出云肥河与八岐大蛇；
- `scene-inaba-shore` / 因幡白兔；
- `scene-inasa-beach` / 稻佐之滨；
- `scene-takachiho-peak` / 高千穗峰；
- `scene-fire-birth-hut` / 木花咲耶姬火中生产；
- `scene-watatsumi-court` / 海神宫内庭。

---

# 8. 日本神话 Visual DNA V2

## 8.1 文明级视觉不再只有“鸟居神社”

建议改为：

```text
Palette
  cloud-white / pearl-gray / ancient-vermillion / deep-indigo / bronze / reed-gold / sea-jade

Motifs
  magatama / sacred mirror / sword / sakaki / shimenawa / reeds / ancient timber / sacred rock / cloud bridge

Materials
  unfinished timber / bronze / stone / woven fiber / silk-like textile / jade-magata / mist / water

Atmosphere
  primordial / sacred / liminal / restrained / luminous / uncanny / natural
```

## 8.2 不同叙事域独立视觉

### 高天原

```text
明亮云海 + 神圣开放空间 + 原始木构 + 镜 / 玉 / 榊
```

### 黄泉

```text
黑岩 + 湿冷洞窟 + 腐朽 + 封界巨石 + 极少暖色
```

### 出云

```text
芦原 + 山林 + 海岸 + 古木 + 青铜剑 + 蛇 / 水气
```

### 天孙降临

```text
高山云层 + 稻穗金 + 天浮桥 / 云路 + 日光
```

### 海神宫

```text
深海青绿 + 珠光 + 贝 / 潮汐 + 日本神代式木构幻想
```

## 8.3 服装与角色视觉防错

必须写入 Japanese Character Art Rules：

- 天照不默认穿平安贵族十二单；
- 须佐之男不默认现代武士铠甲；
- 建御雷不默认战国武将甲胄；
- 大国主不默认神社神官服；
- 天宇受卖不做现代巫女制服；
- 猿田彦避免简单做成“红脸天狗”；
- 八岐大蛇必须是八首 / 八尾这一核心锚点，不被泛化成普通东方龙；
- 辉夜姬可以使用古典宫廷审美，但应归属于《竹取物语》的 interpretation，而不是神代默认美术规范。

---

# 9. Canonical Design 策略

每个 Tier S / A Character 至少需要：

```text
anchors
silhouette
appearance
costumeLanguage
symbols
sacredObjects
mythologicalFacts
sourceScopedFacts
originalDesignChoices
avoid
canonicalPrompt
```

### 示例：天照大神

稳定锚点应优先来自：

- 太阳 / 光明身份；
- 高天原统治者；
- 神镜与天岩户叙事；
- 与须佐之男冲突；
- 勾玉 / 镜 / 榊等 Story 相关符号。

避免：

- 固定照搬伊势神宫现代祭服；
- 现代动漫太阳女神模板；
- 过度中国化的“日轮仙女”；
- 没有来源的巨大金色日轮盔甲。

### 示例：须佐之男

稳定锚点：

- 风暴 / 海原相关神性；
- 高天原冲突；
- 出云流亡；
- 八岐大蛇；
- 草薙剑发现者。

避免：

- 直接复制现代游戏的浪人 / 武士造型；
- 只有雷电、没有神话叙事锚点；
- 把他固定成“邪神反派”。

---

# 10. Structured Content Pipeline

日本补全不允许新增第三套文明专用代码路径。

目标结构：

```text
src/content/
├── greek/
├── norse/
└── japanese/
    ├── catalog.ts
    ├── stories.ts
    ├── assets.ts
    ├── visual-tiers.ts
    ├── sources.ts
    └── index.md
```

同时推动通用：

```text
src/content/registry.ts
scripts/validate-mythology-content.mjs
scripts/sync-mythology-content.mjs
```

调用方式：

```bash
pnpm content:validate japanese
pnpm content:sync japanese
```

而不是：

```bash
node scripts/sync-japanese-content.mjs
```

## 10.1 Validator 必须覆盖

- Story dependency closure；
- dangling character / world / scene ID；
- source coverage；
- sourceScope 合法值；
- mutually-exclusive relation variants；
- duplicate slug / alias；
- Story 顺序；
- Character taxonomy；
- Canonical Design 必填项；
- Tier S 视觉资产完整性；
- Kaguya 不再绑定 Takamagahara；
- World / Scene 语义不能混用；
- 图片 provenance / license metadata。

---

# 11. Character Detail / Graph 集成

日本补全必须直接适配最新 Character Detail 与 3D Graph，不再把内容当作“数据录入之后 UI 自然会工作”。

## 11.1 Character Detail ViewModel

每个日本角色页面应组合：

```text
Identity
Source-scoped Canonical Facts
Symbols / Sacred Objects
Story appearances
World / Scene affinity
Relations
Interpretations
Variants
Visual DNA / Canonical Design
Artwork
```

## 11.2 Graph 文本回退

3D Graph 不能成为关系唯一出口。

SSR 页面必须可读：

```text
父母
配偶
子女
兄弟姊妹
盟友 / 对手
Story 关键关系
来源差异
```

日本神话尤其需要文本回退，因为 relation variant 很多，纯 3D 边无法表达来源差异。

---

# 12. 视觉资产生产分层

P0 不以“壁纸总数”作为完成标准。

## Tier S

12 个核心角色：

- production portrait 100%；
- Character Hero 100%；
- PC wallpaper 至少 1 套；
- Mobile wallpaper 至少 1 套；
- 关键 Story illustration 可复用但必须有 narrative fit。

## Tier A

Story 闭包关键角色：

- portrait 100%；
- 至少 1 个可进入 Character Hero 的正式视觉；
- wallpaper 可在 P0.5 补齐。

## World Tier

5 个 P0 World：

- Hero 100%；
- PC / Mobile 构图至少各 1；
- 每个 World 至少 2 个 Scene 视觉候选。

## Story Tier

30 篇 P0 Story：

- 不要求 30 张独立图；
- 但每篇必须有 Hero Asset；
- 关键节点优先独立 illustration：
  - 黄泉；
  - 禊祓；
  - 天岩户；
  - 八岐大蛇；
  - 国让；
  - 天孙降临；
  - 海神宫。

---

# 13. 实施批次

## Batch 0 — 数据治理与通用 Pipeline

1. 将 Norse 方案中的 generic registry / validator / importer 先落地；
2. 建立 `src/content/japanese/`；
3. 定义 source scope enum；
4. 对 Character Graph relation model 做日本版本差异兼容检查；
5. 修正 Kaguya taxonomy 与 Takamagahara 绑定。

**DoD**：日本内容可以走与 Greek 相同的通用读取 / 校验 / 同步入口。

## Batch 1 — Story Manifest + Source Manifest

1. 落 30 篇 P0 Story metadata；
2. 每篇 Story 绑定具体主来源；
3. 对《日本书纪》异传建立 scope；
4. 输出 dependency manifest；
5. validator 反推出缺失 Entity。

**DoD**：Story Dependency Closure 报告可生成，缺口明确。

## Batch 2 — Character / Relation Closure

1. 保留 Kaguya URL，完成重分类；
2. 创建 Tier S；
3. 创建全部 Story 依赖 Character；
4. 建 genealogy / conflict / spouse / lineage Relation；
5. 所有争议关系带 sourceScope。

**DoD**：P0 Story 无 dangling Character，Graph 无未解释互斥边。

## Batch 3 — World / Scene Closure

1. 升级 Takamagahara；
2. 新建 Ashihara no Nakatsukuni；
3. 新建 Yomi；
4. 新建 Ne no Katasukuni；
5. 新建 Watatsumi Palace；
6. 新建关键 Scene。

**DoD**：30 篇 Story 不再全部复用高天原或泛化背景。

## Batch 4 — Canonical Design + Visual DNA V2

1. Mythology Visual DNA V2；
2. World Visual DNA；
3. Tier S Canonical Design；
4. Tier A Canonical Design；
5. Japanese anti-anachronism rules；
6. Prompt composer 读取 source / tradition / world visual constraints。

**DoD**：不会再默认生成“鸟居 + 神社 + 月色”的泛日本图。

## Batch 5 — Story 正文与 Character Detail

1. 30 篇 Story 正文；
2. Character Story linkage；
3. Character Detail source facts；
4. SSR relation fallback；
5. Graph tradition 切换验证；
6. Mythology 详情页 Story volume。

**DoD**：用户可从天地初成连续读到海幸山幸。

## Batch 6 — Visual Production

1. Tier S portrait；
2. Tier S PC / Mobile wallpaper；
3. 5 World Hero；
4. 关键 Story illustration；
5. provenance / license metadata；
6. R2 / D1 sync。

**DoD**：日本 Mythology、World、Character、Story 页面不存在核心占位视觉。

## Batch 7 — QA / SEO / Release

1. Sitemap；
2. JSON-LD / ImageObject；
3. 角色别名与日英检索；
4. Japanese romanization；
5. Graph mobile / performance；
6. accessibility；
7. source attribution；
8. broken media audit；
9. visual anachronism review；
10. content accuracy review。

---

# 14. 验收指标

不使用“Character >= 50”“Relation >= 150”这类数量 KPI。

P0 验收以覆盖率为准：

```text
Core Story Coverage = 30 / 30
Story Dependency Closure = 100%
Dangling Entity = 0
P0 Claim Source Coverage = 100%
Critical Relation Source Scope = 100%
Tier S Canonical Design = 100%
Tier S Character Detail = 100%
Tier S Production Portrait = 100%
P0 World Hero = 100%
Kaguya Takamagahara Misclassification = 0
Critical Cultural Anachronism = 0
Broken Production Media = 0
```

P0.5 / P1 再扩：

- 月读独立循环；
- 风土记；
- 地方神；
- 古典物语；
- 中世神佛习合；
- 妖怪 / 民俗传统。

---

# 15. 明确不做的错误方案

## 不做 1：先列“日本 100 神”再逐个录入

会得到百科名单，不会得到可连续浏览的神话宇宙。

## 不做 2：把所有日本传统都算成同一个“神道正史”

《古事记》《日本书纪》《风土记》《竹取物语》、中世神佛习合与江户妖怪传统不是同一层级来源。

## 不做 3：把黄泉、根之国、常世统一成一个 Underworld

这些空间在不同文本中的语义并不相同，必须按来源和 Story 独立建模。

## 不做 4：把辉夜姬继续放在高天原

保留角色与 URL，但迁移 tradition / world linkage。

## 不做 5：所有视觉都使用红鸟居、樱花、神社、十二单

这会把神代神话做成“日本旅游 / 和风幻想合集”。

## 不做 6：创建 Japanese-only importer

第三个完整文明必须推动基础设施泛化。

---

# 16. 推荐最终信息架构

```text
Japanese Mythology
├── Origins / 天地初成
│   ├── Primordial Kami
│   ├── Izanagi / Izanami
│   ├── Kuni-umi
│   └── Kami-umi
├── Yomi & Purification / 黄泉与禊祓
│   ├── Yomi
│   ├── Misogi
│   └── Three Noble Children
├── Takamagahara / 高天原
│   ├── Amaterasu
│   ├── Susanoo
│   ├── Ukei
│   └── Ama-no-Iwato
├── Izumo Cycle / 出云神话
│   ├── Yamata no Orochi
│   ├── Ōkuninushi
│   ├── Sukunahikona
│   └── Ne-no-Katasukuni
├── Kuniyuzuri / 国让
│   ├── Takemikazuchi
│   ├── Kotoshironushi
│   └── Takeminakata
├── Tenson Kōrin / 天孙降临
│   ├── Ninigi
│   ├── Sarutahiko
│   ├── Ame-no-Uzume
│   └── Konohanasakuya-hime
├── Sea Cycle / 山海神话
│   ├── Hoderi
│   ├── Hoori
│   ├── Watatsumi
│   └── Toyotama-hime
└── Classical Tales / 古典传说（P1）
    └── Kaguya-hime
```

---

# 17. 执行顺序结论

日本神话补全的正确顺序：

```text
1. Generic Mythology Pipeline
2. Kaguya 数据纠偏
3. Source Manifest
4. 30 Story Manifest
5. Story Dependency Closure
6. Character / Relation
7. World / Scene
8. Visual DNA V2
9. Canonical Design
10. Story 正文
11. Character Detail / Graph
12. Visual Tier Production
13. D1 / R2 Sync
14. QA / SEO / Release
```

而不是：

```text
先生成几十个日本神
→ 再补几张神社壁纸
→ 最后试图把它们拼成故事
```

最终目标不是“日本角色更多了”，而是：

> **让 MythCanvas 中的日本神话成为一套从记纪神代主线出发、版本差异可追溯、人物关系可探索、空间语义清晰、视觉不落入泛和风模板，并能直接驱动 AI 出图的完整内容系统。**

---

# 18. 资料基线

P0 内容审核至少对照：

- 《古事记》上卷 / Kojiki Book I；
- 《日本书纪》卷第一、卷第二 / Nihon Shoki Books I-II，并保留“一书”异传；
- 國學院大學 Encyclopedia of Shinto（用于神名、来源差异与术语交叉校验）；
- 《出云国风土记》等风土记材料（进入 P1 或 Story 明确依赖时）；
- 《古语拾遗》等古代补充文献（P1 source enrichment）。

所有 MythCanvas 正文应原创转述，不复制现代译本长段落；关键异文通过 SourceRef / sourceNotes 解释，而不是伪装成唯一版本。