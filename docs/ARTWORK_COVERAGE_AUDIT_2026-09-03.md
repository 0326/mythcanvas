# MythCanvas 角色图片覆盖审计

> 生成日期：2026-09-03
>
> 数据口径：构建期 `PublicContentCatalog`，不读取远程 D1。角色标记“已有图片”表示最终公开目录中的 `Character.portrait` 存在；该 portrait 可以来自种子内容，也可以由已发布 canonical Artwork 自动派生。

## 总览

- 静态角色总数：287
- 已有角色图片：133
- 没有角色图片：154
- 静态已发布 Artwork：335
- 有 Artwork 关联但未进入静态角色目录：3
- 对应角色 ID：`character-brahma`、`character-erlang-shen`、`character-ishtar`

| 神话体系 | 角色数 | 有图片 | 无图片 | 角色类 Artwork | 全部 Artwork | 状态 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 中国神话 | 1 | 1 | 0 | 38 | 39 | 已覆盖 |
| 希腊神话 | 67 | 27 | 40 | 61 | 62 | 需要补图 |
| 北欧神话 | 32 | 28 | 4 | 44 | 45 | 需要补图 |
| 埃及神话 | 25 | 25 | 0 | 62 | 63 | 已覆盖 |
| 印度神话 | 0 | 0 | 0 | 4 | 4 | 角色未进入静态目录 |
| 日本神话 | 38 | 1 | 37 | 0 | 1 | 需要补图 |
| 凯尔特神话 | 43 | 31 | 12 | 62 | 62 | 需要补图 |
| 玛雅神话 | 19 | 19 | 0 | 38 | 38 | 已覆盖 |
| 阿兹特克神话 | 18 | 0 | 18 | 0 | 0 | 需要补图 |
| 美索不达米亚神话 | 44 | 1 | 43 | 21 | 21 | 需要补图 |

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

### 日本神话（37 个）

- 八岐大蛇（`yamata-no-orochi`）
- 布刀玉命（`futodama`）
- 大国主神（`okuninushi`）
- 大物主神（`omononushi`）
- 邇邇艺命（`ninigi`）
- 丰玉姬（`toyotama-hime`）
- 高御产巢日神（`takami-musubi`）
- 海神（`watatsumi`）
- 火远理命（`hoori`）
- 火照命（`hoderi`）
- 火之迦具土神（`kagutsuchi`）
- 建御雷神（`takemikazuchi`）
- 建御名方神（`takeminakata`）
- 经津主神（`futsunushi`）
- 木花咲耶姬（`konohanasakuya-hime`）
- 少彦名神（`sukunahikona`）
- 神产巢日神（`kami-musubi`）
- 石长比卖（`iwanagahime`）
- 事代主神（`kotoshironushi`）
- 手名椎（`te-na-zuchi`）
- 思兼神（`omoikane`）
- 天儿屋命（`ame-no-koyane`）
- 天菩比神（`ame-no-hohi`）
- 天忍穗耳命（`ame-no-oshihomimi`）
- 天若日子（`ame-no-wakahiko`）
- 天手力男神（`ame-no-tajikarao`）
- 天宇受卖命（`ame-no-uzume`）
- 天照大御神（`amaterasu`）
- 天之御中主神（`ameno-minakanushi`）
- 须势理毗卖（`suseribime`）
- 须佐之男命（`susanoo`）
- 伊邪那美（`izanami`）
- 伊邪那岐（`izanagi`）
- 猿田彦神（`sarutahiko`）
- 月读命（`tsukuyomi`）
- 栉名田比卖（`kushinadahime`）
- 足名椎（`ashina-zuchi`）

### 凯尔特神话（12 个）

- 基安（`cian`）
- 凯尔·伊博尔梅斯（`caer-ibormeith`）
- 孔科巴尔·麦克·内萨（`conchobar-mac-nessa`）
- 卢厄·劳·盖弗斯（`lleu-law-gyffes`）
- 洛伊格（`loeg`）
- 马查（`macha`）
- 马纳南·麦克利尔（`manannan`）
- 马纳韦丹（`manawydan`）
- 马思·马松维（`math`）
- 米亚赫（`miach`）
- 努阿达（`nuada`）
- 普利德里（`pryderi`）

### 玛雅神话（0 个）

无。

### 阿兹特克神话（18 个）

- 查尔奇乌特利奎（`chalchiuhtlicue`）
- 霍奇皮利（`xochipilli`）
- 科亚特利库埃（`coatlicue`）
- 科约尔沙乌基（`coyolxauhqui`）
- 魁札尔科亚特尔（`quetzalcoatl`）
- 米克特卡西瓦特尔（`mictecacihuatl`）
- 米克特兰特库特利（`mictlantecuhtli`）
- 纳纳瓦钦（`nanahuatzin`）
- 森宗·维茨纳瓦（`centzon-huitznahua`）
- 索洛特尔（`xolotl`）
- 特库西斯特卡特尔（`tecuciztecatl`）
- 特拉尔特库特利（`tlaltecuhtli`）
- 特拉洛克（`tlaloc`）
- 特斯卡特利波卡（`tezcatlipoca`）
- 托纳提乌（`tonatiuh`）
- 维齐洛波奇特利（`huitzilopochtli`）
- 西佩·托特克（`xipe-totec`）
- 休休特库特利（`xiuhtecuhtli`）

### 美索不达米亚神话（43 个）

- 阿达帕（`adapa`）
- 阿努纳奇（`anunnaki`）
- 阿普苏（`apsu-enuma-elish`）
- 阿萨格（`asag`）
- 阿舒尔（`ashur`）
- 阿特拉哈西斯（`atrahasis`）
- 阿雅（`aya`）
- 埃列什基伽尔（`ereshkigal`）
- 埃塔纳（`etana`）
- 安 / 阿努（`an-anu`）
- 安祖（`anzu`）
- 杜穆兹 / 塔木兹（`dumuzi-tammuz`）
- 恩基 / 埃阿（`enki-ea`）
- 恩利尔（`enlil`）
- 恩奇都（`enkidu`）
- 盖什提南娜（`geshtinanna`）
- 洪巴巴（`humbaba`）
- 金古（`kingu`）
- 马尔杜克（`marduk`）
- 穆什胡什（`mushussu`）
- 纳布（`nabu`）
- 纳姆塔尔（`namtar`）
- 娜木姆（`nammu`）
- 南纳 / 辛（`nanna-sin`）
- 涅伽尔（`nergal`）
- 宁胡尔萨格（`ninhursaga`）
- 宁利尔（`ninlil`）
- 宁舒布尔（`ninshubur`）
- 宁松（`ninsun`）
- 宁乌尔塔（`ninurta`）
- 努斯库（`nusku`）
- 齐乌苏德拉（`ziusudra`）
- 萨尔帕尼图姆（`sarpanitum`）
- 沙拉（`shala`）
- 提阿马特（`tiamat`）
- 天之公牛（`bull-of-heaven`）
- 乌尔珊纳比（`urshanabi`）
- 乌特纳比什提姆（`utnapishtim`）
- 乌图 / 沙玛什（`utu-shamash`）
- 西杜里（`siduri`）
- 伊吉吉（`igigi`）
- 伊南娜 / 伊什塔尔（`inanna-ishtar`）
- 伊什库尔 / 阿达德（`ishkur-adad`）

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
