# MythCanvas 北欧 Story Map

> 由 `src/content/norse/story-manifest.ts` 与 `source-coverage.ts` 生成。此文档是 Phase 2 研究快照，不替代源文件；修改范围应回写到静态 Manifest。

## 基线

- Source Registry：45
- Coverage Rows：45
- Unique Story Units：74
- P0 / P1 / P2：56 / 16 / 2
- 已 source-reviewed / published 的 P0 Story Manifest：56 / 56
- 当前已落库静态内容（Character / World / Scene / Object / Story / CharacterRelation / ContentRelation）：34 / 8 / 15 / 16 / 36 / 35 / 5
- 当前 Story readiness（public / source-reviewed-or-visual-ready / prototype）：36 / 0 / 36
- 现有 Story 迁移决策：36 / 36
- 新增 Story 待办：37
- Story Manifest 依赖缺口：71（作为 Phase 3–4 的实体补全待办，不是本阶段 gate failure）
- 已解决 P0 已知问题：7
- 已范围化 P0 版本冲突：6
- Report Gate：通过

## Story Cycles

### creation（8）

- [P0] 尤弥尔与世界的诞生 · `ymir-creation` · norse-src-prose-edda-gylfaginning chs. 4–8
- [P0] 奥德胡姆拉与布里 · `audhumla-and-buri` · norse-src-prose-edda-gylfaginning ch. 6
- [P0] 尤弥尔之躯化为世界 · `ymir-world-making` · norse-src-prose-edda-gylfaginning ch. 8
- [P0] 阿斯克与恩布拉 · `ask-and-embla` · norse-src-voluspa st. 17–18
- [P0] 世界树与三口井 · `yggdrasil-and-wells` · norse-src-grimnismal st. 29–35
- [P0] 诺恩与命运之井 · `norns-at-urdarbrunnr` · norse-src-voluspa st. 20
- [P0] 日月与追逐者 · `sun-moon-pursuers` · norse-src-voluspa st. 5, 40–41
- [P1] 尼德霍格与世界树 · `nidhoggr-and-world-tree` · norse-src-grimnismal st. 32–35

### gods-and-treasures（10）

- [P0] 古尔薇格与阿萨—华纳之战 · `gullveig-and-aesir-vanir-war` · norse-src-voluspa st. 21–24
- [P0] 阿萨与华纳的和约 · `aesir-vanir-truce` · norse-src-prose-edda-skaldskaparmal ch. 57
- [P0] 克瓦希尔与诗歌蜜酒 · `kvasir-and-mead` · norse-src-prose-edda-skaldskaparmal ch. 1
- [P0] 奥丁夺取诗歌蜜酒 · `odin-steals-mead` · norse-src-prose-edda-skaldskaparmal ch. 1
- [P0] 伊登与夏基 · `idunn-and-thjazi` · norse-src-haustlong st. 1–13
- [P0] 斯卡蒂的赔偿 · `skadi-compensation` · norse-src-prose-edda-gylfaginning ch. 23
- [P0] 尼约德与斯卡蒂的婚姻 · `njordr-and-skadi` · norse-src-prose-edda-gylfaginning ch. 23
- [P0] 阿斯加德城墙与斯莱普尼尔 · `asgard-wall-and-sleipnir` · norse-src-prose-edda-gylfaginning ch. 42
- [P0] 西芙的头发与诸神宝物 · `sifs-hair-and-treasures` · norse-src-prose-edda-skaldskaparmal ch. 35
- [P0] 弗雷与葛德 · `freyr-and-gerdr` · norse-src-skirnismal st. 1–42

### odin-cycle（9）

- [P0] 克瓦希尔与诗歌蜜酒 · `kvasir-and-mead` · norse-src-prose-edda-skaldskaparmal ch. 1
- [P0] 奥丁夺取诗歌蜜酒 · `odin-steals-mead` · norse-src-prose-edda-skaldskaparmal ch. 1
- [P0] 奥丁以一只眼换取智慧 · `odin-and-mimir` · norse-src-voluspa st. 28
- [P0] 奥丁悬于世界树九夜 · `odin-on-world-tree` · norse-src-havamal st. 138–141
- [P0] 奥丁与瓦夫苏鲁德尼尔 · `odin-and-vafthrudnir` · norse-src-vafthrudnismal st. 1–55
- [P0] 格里姆尼尔的启示 · `grimnir-revealed` · norse-src-grimnismal st. 1–54
- [P1] 胡金与穆宁 · `odin-ravens` · norse-src-grimnismal st. 20
- [P0] 瓦尔哈拉与女武神 · `valholl-and-valkyries` · norse-src-grimnismal st. 8–13, 36
- [P1] 奥丁与塞德魔法 · `odin-seidr` · norse-src-ynglinga-saga ch. 7

### thor-cycle（10）

- [P0] 索尔与赫朗格尼尔 · `thor-and-hrungnir` · norse-src-haustlong st. 14–20
- [P0] 索尔与海米尔的大锅 · `thor-and-hymir` · norse-src-hymiskvida st. 1–39
- [P0] 索尔垂钓世界蛇 · `thor-fishes-for-serpent` · norse-src-hymiskvida st. 17–24
- [P0] 雷神之锤被盗 · `thryms-stolen-hammer` · norse-src-thrymskvida st. 1–32
- [P1] 索尔、夏尔菲与罗丝克瓦 · `thor-and-thjalfi-roskva` · norse-src-prose-edda-gylfaginning ch. 44
- [P0] 索尔与斯克里米尔 · `thor-and-skrymir` · norse-src-prose-edda-gylfaginning ch. 45
- [P0] 索尔在乌特加德 · `thor-in-utgard` · norse-src-prose-edda-gylfaginning ch. 46–47
- [P0] 索尔与盖尔罗德 · `thor-and-geirrod` · norse-src-thorsdrapa selected stanzas
- [P1] 索尔与阿尔维斯 · `thor-and-alviss` · norse-src-alvissmal st. 1–35
- [P1] 索尔与哈巴德 · `thor-and-harbard` · norse-src-harbardsljod st. 1–60

### loki-cycle（9）

- [P0] 伊登与夏基 · `idunn-and-thjazi` · norse-src-haustlong st. 1–13
- [P0] 阿斯加德城墙与斯莱普尼尔 · `asgard-wall-and-sleipnir` · norse-src-prose-edda-gylfaginning ch. 42
- [P0] 西芙的头发与诸神宝物 · `sifs-hair-and-treasures` · norse-src-prose-edda-skaldskaparmal ch. 35
- [P0] 洛基与安格尔伯达 · `loki-and-angrboda` · norse-src-prose-edda-gylfaginning ch. 34
- [P0] 芬里尔与格莱普尼尔 · `fenrir-and-gleipnir` · norse-src-prose-edda-gylfaginning ch. 34
- [P0] 洛基的宴席争辩 · `lokis-feast` · norse-src-lokasenna st. 1–65
- [P0] 洛基与巴德尔之死 · `loki-and-baldr` · norse-src-prose-edda-gylfaginning ch. 49
- [P0] 洛基被捕与束缚 · `loki-bound` · norse-src-prose-edda-gylfaginning ch. 50
- [P0] 洛基在诸神黄昏 · `loki-at-ragnarok` · norse-src-voluspa st. 46–51

### baldr-ragnarok（16）

- [P0] 芬里尔与格莱普尼尔 · `fenrir-and-gleipnir` · norse-src-prose-edda-gylfaginning ch. 34
- [P0] 洛基与巴德尔之死 · `loki-and-baldr` · norse-src-prose-edda-gylfaginning ch. 49
- [P0] 洛基被捕与束缚 · `loki-bound` · norse-src-prose-edda-gylfaginning ch. 50
- [P0] 洛基在诸神黄昏 · `loki-at-ragnarok` · norse-src-voluspa st. 46–51
- [P0] 巴德尔的梦 · `baldrs-dreams` · norse-src-baldrs-draumar st. 1–14
- [P0] 巴德尔之死 · `baldrs-death` · norse-src-prose-edda-gylfaginning ch. 49
- [P0] 巴德尔的葬礼 · `baldrs-funeral` · norse-src-prose-edda-gylfaginning ch. 49
- [P0] 赫尔莫德前往赫尔 · `hermod-rides-to-hel` · norse-src-prose-edda-gylfaginning ch. 49
- [P1] 瓦利为巴德尔复仇 · `vali-avenges-baldr` · norse-src-voluspa st. 32–33
- [P0] 芬布尔之冬 · `fimbulwinter` · norse-src-voluspa st. 41–45
- [P0] 奥丁与芬里尔 · `odin-and-fenrir` · norse-src-voluspa st. 53–54
- [P0] 索尔与世界蛇的最后一战 · `thor-and-jormungandr-final-battle` · norse-src-voluspa st. 56
- [P0] 弗雷与苏尔特 · `freyr-and-surtr` · norse-src-prose-edda-gylfaginning ch. 51
- [P1] 提尔与加姆 · `tyr-and-garmr` · norse-src-prose-edda-gylfaginning ch. 51
- [P0] 海姆达尔与洛基 · `heimdall-and-loki` · norse-src-voluspa st. 46, 51
- [P0] 世界毁灭、回归与新生 · `ragnarok-renewal` · norse-src-voluspa st. 54–66

### volsung-cycle（12）

- [P0] 沃尔松格与树中神剑 · `volsung-and-sword-tree` · norse-src-volsunga-saga chs. 2–3
- [P0] 西格妮与西格盖尔 · `signy-and-siggeir` · norse-src-volsunga-saga chs. 3–8
- [P0] 西格蒙德与辛菲奥特利 · `sigmund-and-sinfjotli` · norse-src-volsunga-saga chs. 7–10
- [P0] 西格蒙德之死与希奥尔迪斯 · `sigmunds-death-and-hjordis` · norse-src-volsunga-saga chs. 11–12
- [P0] 安德瓦里与被诅咒的黄金 · `andvari-gold` · norse-src-reginsmal st. 1–26
- [P0] 西格尔德与雷金 · `sigurd-and-regin` · norse-src-reginsmal st. 1–40
- [P0] 西格尔德斩杀法夫纳 · `sigurd-kills-fafnir` · norse-src-fafnismal st. 1–44
- [P0] 西格尔德与西格德里法 · `sigurd-and-sigrdrifa` · norse-src-sigrdrifumal st. 1–37
- [P0] 西格尔德与布伦希尔德 · `sigurd-and-brynhildr` · norse-src-volsunga-saga chs. 20–27
- [P0] 西格尔德之死 · `sigurds-death` · norse-src-sigurdarkvida fragmentary poems; scoped comparison with saga
- [P0] 古德伦与阿特利 · `gudrun-and-atli` · norse-src-atlakvida st. 1–46
- [P1] 古德伦、斯万希尔德与哈姆迪尔兄弟 · `gudrun-svanhild-hamdir-sorli` · norse-src-hamdismal st. 1–30

### helgi-cycle（4）

- [P1] 赫尔吉·希奥尔瓦尔松与斯瓦瓦 · `helgi-hjorvardsson-and-svava` · norse-src-helgakvida-hjorvardssonar st. 1–51
- [P1] 赫尔吉·洪丁斯巴尼 · `helgi-hundingsbani` · norse-src-helgakvida-hundingsbana-1 st. 1–57
- [P1] 赫尔吉与西格伦 · `helgi-and-sigrun` · norse-src-helgakvida-hundingsbana-2 st. 1–51
- [P1] 赫尔吉的葬丘与归来 · `helgi-burial-mound` · norse-src-helgakvida-hundingsbana-2 st. 39–51

### independent-eddic（5）

- [P1] 沃伦德：被囚的铁匠 · `volundr-captive-smith` · norse-src-volundarkvida st. 1–19
- [P1] 沃伦德的逃离 · `volundr-escape` · norse-src-volundarkvida st. 20–41
- [P1] 斯维普达格与孟格洛德 · `svipdagr-and-mengloth` · norse-src-svipdagsmal Grógaldr and Fjölsvinnsmál; editorial split to be reviewed
- [P2] 里格与社会秩序 · `rig-and-social-orders` · norse-src-rigsthula selected stanzas
- [P2] 格罗蒂之歌 · `grottasongr` · norse-src-grottasongr selected stanzas

## Source-scoped Variant Notes

- [P0] Garmr and Fenrir are not silently merged. · Keep Garmr and Fenrir as separate Characters unless a reader-facing comparison explicitly gives its source scope and uncertainty.
- [P0] Hárbarðr’s identification with Odin is an interpretation, not an unscoped fact. · Describe the speaker as Hárbarðr first; any Odin identification must be framed as an editorial or scholarly reading.
- [P0] Loki’s agency in Baldr’s death has different textual visibility across witnesses. · Do not retroactively assign the detailed Gylfaginning plot to Baldrs draumar; identify the witness behind each claim.
- [P0] Ragnarök’s survivors and post-catastrophe ordering are source-scoped. · Present survivor and return lists with their source scope; do not synthesize a single exhaustive post-Ragnarök roster.
- [P0] Sigrdrífa and Brynhildr are related but not automatically identical across witnesses. · Keep source lanes and names explicit; any merged Character treatment requires an editorial note with the relevant witnesses.
- [P0] Skírnismál’s courtship includes coercive speech that must not be softened into generic romance. · Retell the negotiation with age-appropriate restraint while preserving the text’s coercive stakes and source scope.
- [P1] Ynglinga saga’s euhemeristic framing is not interchangeable with mythological-poetry claims. · Name the euhemeristic frame whenever this witness is used; do not let it silently determine divine biography.

## Phase 3–4 Dependency Gaps

### character（71）

- `character-urd` ← norse-manifest-norns-at-urdarbrunnr
- `character-verdandi` ← norse-manifest-norns-at-urdarbrunnr
- `character-skuld` ← norse-manifest-norns-at-urdarbrunnr
- `character-sol` ← norse-manifest-sun-moon-pursuers
- `character-mani` ← norse-manifest-sun-moon-pursuers
- `character-skoll` ← norse-manifest-sun-moon-pursuers
- `character-hati` ← norse-manifest-sun-moon-pursuers
- `character-nidhoggr` ← norse-manifest-nidhoggr-and-world-tree
- `character-gullveig` ← norse-manifest-gullveig-and-aesir-vanir-war
- `character-kvasir` ← norse-manifest-kvasir-and-mead
- `character-thjazi` ← norse-manifest-idunn-and-thjazi
- `character-skirnir` ← norse-manifest-freyr-and-gerdr
- `character-vafthrudnir` ← norse-manifest-odin-and-vafthrudnir
- `character-huginn` ← norse-manifest-odin-ravens
- `character-muninn` ← norse-manifest-odin-ravens
- `character-hrungnir` ← norse-manifest-thor-and-hrungnir
- `character-hymir` ← norse-manifest-thor-and-hymir
- `character-hymir` ← norse-manifest-thor-fishes-for-serpent
- `character-thjalfi` ← norse-manifest-thor-and-thjalfi-roskva
- `character-roskva` ← norse-manifest-thor-and-thjalfi-roskva
- `character-skrymir` ← norse-manifest-thor-and-skrymir
- `character-utgarda-loki` ← norse-manifest-thor-in-utgard
- `character-geirrod` ← norse-manifest-thor-and-geirrod
- `character-gjalp` ← norse-manifest-thor-and-geirrod
- `character-greip` ← norse-manifest-thor-and-geirrod
- `character-alviss` ← norse-manifest-thor-and-alviss
- `character-angrboda` ← norse-manifest-loki-and-angrboda
- `character-vali` ← norse-manifest-vali-avenges-baldr
- `character-garmr` ← norse-manifest-tyr-and-garmr
- `character-volsung` ← norse-manifest-volsung-and-sword-tree
- `character-sigmund` ← norse-manifest-volsung-and-sword-tree
- `character-signy` ← norse-manifest-signy-and-siggeir
- `character-siggeir` ← norse-manifest-signy-and-siggeir
- `character-sigmund` ← norse-manifest-signy-and-siggeir
- `character-sigmund` ← norse-manifest-sigmund-and-sinfjotli
- `character-sinfjotli` ← norse-manifest-sigmund-and-sinfjotli
- `character-sigmund` ← norse-manifest-sigmunds-death-and-hjordis
- `character-hjordis` ← norse-manifest-sigmunds-death-and-hjordis
- `character-andvari` ← norse-manifest-andvari-gold
- `character-ottr` ← norse-manifest-andvari-gold
- `character-hreidmar` ← norse-manifest-andvari-gold
- `character-regin` ← norse-manifest-sigurd-and-regin
- `character-regin` ← norse-manifest-sigurd-kills-fafnir
- `character-gudrun` ← norse-manifest-sigurds-death
- `character-gunnar` ← norse-manifest-sigurds-death
- `character-hogni` ← norse-manifest-sigurds-death
- `character-gudrun` ← norse-manifest-gudrun-and-atli
- `character-atli` ← norse-manifest-gudrun-and-atli
- `character-gunnar` ← norse-manifest-gudrun-and-atli
- `character-hogni` ← norse-manifest-gudrun-and-atli
- `character-gudrun` ← norse-manifest-gudrun-svanhild-hamdir-sorli
- `character-svanhildr` ← norse-manifest-gudrun-svanhild-hamdir-sorli
- `character-hamdir` ← norse-manifest-gudrun-svanhild-hamdir-sorli
- `character-sorli` ← norse-manifest-gudrun-svanhild-hamdir-sorli
- `character-helgi-hjorvardsson` ← norse-manifest-helgi-hjorvardsson-and-svava
- `character-svava` ← norse-manifest-helgi-hjorvardsson-and-svava
- `character-helgi-hundingsbani` ← norse-manifest-helgi-hundingsbani
- `character-sigrun` ← norse-manifest-helgi-hundingsbani
- `character-sinfjotli` ← norse-manifest-helgi-hundingsbani
- `character-helgi-hundingsbani` ← norse-manifest-helgi-and-sigrun
- `character-sigrun` ← norse-manifest-helgi-and-sigrun
- `character-helgi-hundingsbani` ← norse-manifest-helgi-burial-mound
- `character-sigrun` ← norse-manifest-helgi-burial-mound
- `character-volundr` ← norse-manifest-volundr-captive-smith
- `character-nidudr` ← norse-manifest-volundr-captive-smith
- `character-volundr` ← norse-manifest-volundr-escape
- `character-bodvildr` ← norse-manifest-volundr-escape
- `character-svipdagr` ← norse-manifest-svipdagr-and-mengloth
- `character-groa` ← norse-manifest-svipdagr-and-mengloth
- `character-mengloth` ← norse-manifest-svipdagr-and-mengloth
- `character-rigr` ← norse-manifest-rig-and-social-orders

## Gate Issues

- 无。
