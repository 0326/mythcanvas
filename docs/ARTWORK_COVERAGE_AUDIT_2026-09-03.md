# MythCanvas 角色图片覆盖审计

> 生成日期：2026-09-05
>
> 数据口径：构建期 `PublicContentCatalog`，不读取远程 D1。角色标记“已有图片”表示最终公开目录中的 `Character.portrait` 存在；该 portrait 可以来自种子内容，也可以由已发布 canonical Artwork 自动派生。

## 总览

- 静态角色总数：287
- 已有角色图片：236
- 没有角色图片：51
- 静态已发布 Artwork：541
- 有 Artwork 关联但未进入静态角色目录：3
- 对应角色 ID：`character-brahma`、`character-erlang-shen`、`character-ishtar`

| 神话体系 | 角色数 | 有图片 | 无图片 | 角色类 Artwork | 全部 Artwork | 状态 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 中国神话 | 1 | 1 | 0 | 38 | 39 | 已覆盖 |
| 希腊神话 | 67 | 27 | 40 | 61 | 62 | 需要补图 |
| 北欧神话 | 32 | 28 | 4 | 44 | 45 | 需要补图 |
| 埃及神话 | 25 | 25 | 0 | 62 | 63 | 已覆盖 |
| 印度神话 | 0 | 0 | 0 | 4 | 4 | 角色未进入静态目录 |
| 日本神话 | 38 | 38 | 0 | 74 | 75 | 已覆盖 |
| 凯尔特神话 | 43 | 43 | 0 | 86 | 86 | 已覆盖 |
| 玛雅神话 | 19 | 19 | 0 | 38 | 38 | 已覆盖 |
| 阿兹特克神话 | 18 | 18 | 0 | 36 | 36 | 已覆盖 |
| 美索不达米亚神话 | 44 | 37 | 7 | 93 | 93 | 需要补图 |

## 无图片角色明细

### 中国神话（0 个）

无。

### 希腊神话（40 个）

- 阿伽门农（`agamemnon`）
- 阿里阿德涅（`ariadne`）
- 阿瑞斯（`ares`）
- 阿塔兰忒（`atalanta`）
- 阿特拉斯（`atlas`）
- 柏勒洛丰（`bellerophon`）
- 波吕斐摩斯（`polyphemus`）
- 代达罗斯（`daedalus`）
- 堤丰（`typhon`）
- 俄狄浦斯（`oedipus`）
- 俄耳甫斯（`orpheus`）
- 厄洛斯（`eros`）
- 盖亚（`gaia`）
- 海伦（`helen`）
- 卡俄斯（`chaos`）
- 卡吕普索（`calypso`）
- 克洛诺斯（`cronus`）
- 刻耳柏洛斯（`cerberus`）
- 勒托（`leto`）
- 迈亚（`maia`）
- 米诺陶洛斯（`minotaur`）
- 墨涅拉俄斯（`menelaus`）
- 墨提斯（`metis`）
- 倪克斯（`nyx`）
- 欧律狄刻（`eurydice`）
- 帕里斯（`paris`）
- 帕特罗克洛斯（`patroclus`）
- 皮同（`python`）
- 珀伽索斯（`pegasus`）
- 普里阿摩斯（`priam`）
- 奇美拉（`chimera`）
- 瑞亚（`rhea`）
- 塞墨勒（`semele`）
- 塞壬（`sirens`）
- 斯芬克斯（`sphinx`）
- 塔耳塔罗斯（`tartarus`）
- 忒勒马科斯（`telemachus`）
- 乌拉诺斯（`uranus`）
- 许德拉（`hydra`）
- 伊卡洛斯（`icarus`）

### 北欧神话（4 个）

- 博尔（`bor`）
- 布里（`buri`）
- 威利（`vili`）
- 维（`ve`）

### 埃及神话（0 个）

无。

### 印度神话（0 个）

该体系当前没有角色进入静态 `PublicContentCatalog`，需要先完成角色内容注册，再进入图片生产。

### 日本神话（0 个）

无。

### 凯尔特神话（0 个）

无。

### 玛雅神话（0 个）

无。

### 阿兹特克神话（0 个）

无。

### 美索不达米亚神话（7 个）

- 纳姆塔尔（`namtar`）
- 宁舒布尔（`ninshubur`）
- 宁松（`ninsun`）
- 齐乌苏德拉（`ziusudra`）
- 沙拉（`shala`）
- 乌特纳比什提姆（`utnapishtim`）
- 西杜里（`siduri`）

## 建议补图顺序

1. **P0：体系入口和核心角色**：优先处理印度角色注册，以及埃及、希腊、日本、美索不达米亚、玛雅、阿兹特克、凯尔特的核心角色；这些体系当前缺图比例最高。
2. **P1：完整 canonical 覆盖**：每个角色至少补一张 `canonical` 手机图；核心角色再补 `canonical` PC 图，避免角色卡和详情页继续出现符号兜底。
3. **P2：Style 变体**：canonical 覆盖完成后，再补 Anime、Cinematic、Sacred 等风格，不能用风格变体替代角色 canonical 身份图。

## 正确补图流程

```text
Character / CharacterVariant + VisualDNA + Style + OutputSpec
→ 生成并完成身份 / 风格 / 壁纸规格 QA
→ 上传 R2
→ 导入并审核为 published + approved
→ npm run content:export-artworks（从本地 D1 镜像导出）
→ 构建部署
```

注意：没有图片的角色仍保留符号兜底是当前设计行为；不要把神话体系 Hero 或通用占位图伪装成角色肖像。
