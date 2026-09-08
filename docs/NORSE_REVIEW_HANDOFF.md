# 北欧神话人工审校交接单

> 这份交接单把机器侧已完成的内容拆成可分批签核的工作包。它不替代来源阅读、身份审计、视觉 QA 或产品验收；所有 `ready` 只表示可以开始人工复核。

- 认证命令：`npm run content:certify:norse`；当前若仍有人工 Gate 未完成，该命令应失败并列出阻塞项。

- 生成时间：2026-09-07T17:08:48.534Z
- Snapshot version：norse-completion-snapshot-v2-efbe92674e040b87
- 机器来源预审：74 / 74 可进入人工复核
- P0 来源审校：0 / 56
- World 双端视觉批准：0 / 8
- Story key-moment 视觉批准：0 / 74
- Phase 6 identity audit：pending（7 names / 4 interpretations / 10 claims）
- Collection Discovery：blocked-until-completion；当前候选 Cycle 0 / 9

## 执行顺序

1. 先按下表完成 P0 Story 来源审校；`changes-requested` 必须回写正文、locator、依赖或 Claim 后重审。
2. 再审 P1/P2 与跨 Cycle 关系，明确版本差异和本期排除项。
3. 并行审 World 桌面/移动双端构图；同一 World 两端都通过后才可标记批准。
4. 审 Story key-moment 图像：来源边界、角色身份、场景锚点、构图安全区、双端/主题适配和原创性分别记录。
5. 完成身份审计队列与 P2 排除项决策，并将结果写回对应静态内容或审计记录。
6. 所有 P0、视觉组、身份审计和排除项完成后，先生成 Snapshot A；再写入 identity audit / product sign-off，并重新生成 Snapshot B。若版本变化，必须按 B 重绑记录并重跑，直到版本稳定。
7. 版本稳定后，由产品负责人完成 product sign-off，并由真人将独立 Snapshot approval 绑定同一最终版本；最后运行 `npm run content:certify:norse`。

## Cycle 级内容批次

| 批次 | Story | P0 | 机器预审可复核 | 已 source-reviewed | 当前状态 |
|---|---:|---:|---:|---:|---|
| `creation` | 8 | 7 | 8 | 0 | 可开始人工来源审校 |
| `gods-and-treasures` | 10 | 10 | 10 | 0 | 可开始人工来源审校 |
| `odin-cycle` | 9 | 7 | 9 | 0 | 可开始人工来源审校 |
| `thor-cycle` | 10 | 7 | 10 | 0 | 可开始人工来源审校 |
| `loki-cycle` | 9 | 9 | 9 | 0 | 可开始人工来源审校 |
| `baldr-ragnarok` | 16 | 14 | 16 | 0 | 可开始人工来源审校 |
| `volsung-cycle` | 12 | 11 | 12 | 0 | 可开始人工来源审校 |
| `helgi-cycle` | 4 | 0 | 4 | 0 | 可开始人工来源审校 |
| `independent-eddic` | 5 | 0 | 5 | 0 | 可开始人工来源审校 |

## 可领取的 Story 来源审校工作包

> 每个工作包最多 4 篇，按 P0 → P1 → P2 排序；同一 Story 只分配到一个工作包，跨 Cycle 归属仍以 Cycle 表和 Story Manifest 为准。工作包状态只表示机器预审是否完成，不代表人工批准。审校人领取后应按包回写 `stories.ts`，并在修改后重新生成本交接单。

| 工作包 | Cycle | Story（slug） | P0 | P2 暂缓 | 来源 | 当前状态 |
|---|---|---|---:|---:|---|---|
| `norse-review-01` | `creation` | `ymir-creation` (P0)<br>`audhumla-and-buri` (P0)<br>`odin-creates-world` (P0)<br>`ask-and-embla` (P0) | 4 | 0 | norse-src-prose-edda-gylfaginning, norse-src-voluspa | 可领取 |
| `norse-review-02` | `creation` | `yggdrasil-wells-norns` (P0)<br>`norns-at-urdarbrunnr` (P0)<br>`sun-and-moon-chase` (P0)<br>`nidhoggr-and-world-tree` (P1) | 3 | 0 | norse-src-grimnismal, norse-src-voluspa | 可领取 |
| `norse-review-03` | `gods-and-treasures` | `aesir-vanir-war` (P0)<br>`aesir-vanir-truce` (P0)<br>`kvasir-and-mead` (P0)<br>`freyr-and-gerdr` (P0) | 4 | 0 | norse-src-voluspa, norse-src-prose-edda-skaldskaparmal, norse-src-skirnismal | 可领取 |
| `norse-review-04` | `gods-and-treasures` | `odin-steals-mead` (P0)<br>`idunn-and-thjazi` (P0)<br>`asgard-wall-and-sleipnir` (P0)<br>`sifs-hair-and-treasures` (P0) | 4 | 0 | norse-src-prose-edda-skaldskaparmal, norse-src-haustlong, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-05` | `gods-and-treasures` | `skadi-compensation` (P0)<br>`njordr-and-skadi` (P0) | 2 | 0 | norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-06` | `odin-cycle` | `odin-and-mimir` (P0)<br>`odin-world-tree` (P0)<br>`odin-and-vafthrudnir` (P0)<br>`grimnir-revealed` (P0) | 4 | 0 | norse-src-voluspa, norse-src-havamal, norse-src-vafthrudnismal, norse-src-grimnismal | 可领取 |
| `norse-review-07` | `odin-cycle` | `valholl-and-valkyries` (P0)<br>`odin-ravens` (P1)<br>`odin-seidr` (P1) | 1 | 0 | norse-src-grimnismal, norse-src-ynglinga-saga | 可领取 |
| `norse-review-08` | `thor-cycle` | `thor-and-hrungnir` (P0)<br>`thor-fishes-for-serpent` (P0)<br>`thryms-stolen-hammer` (P0)<br>`thor-in-utgard` (P0) | 4 | 0 | norse-src-prose-edda-skaldskaparmal, norse-src-hymiskvida, norse-src-thrymskvida, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-09` | `thor-cycle` | `thor-and-geirrod` (P0)<br>`thor-and-hymir` (P0)<br>`thor-and-skrymir` (P0)<br>`thor-and-thjalfi-roskva` (P1) | 3 | 0 | norse-src-thorsdrapa, norse-src-hymiskvida, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-10` | `thor-cycle` | `thor-and-alviss` (P1)<br>`thor-and-harbard` (P1) | 0 | 0 | norse-src-alvissmal, norse-src-harbardsljod | 可领取 |
| `norse-review-11` | `loki-cycle` | `loki-bound` (P0)<br>`fenrir-and-gleipnir` (P0)<br>`lokis-feast` (P0)<br>`loki-and-baldr` (P0) | 4 | 0 | norse-src-prose-edda-gylfaginning, norse-src-lokasenna | 可领取 |
| `norse-review-12` | `loki-cycle` | `loki-at-ragnarok` (P0)<br>`loki-and-angrboda` (P0) | 2 | 0 | norse-src-voluspa, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-13` | `baldr-ragnarok` | `baldrs-dreams` (P0)<br>`fimbulwinter` (P0)<br>`baldrs-death` (P0)<br>`odin-and-fenrir` (P0) | 4 | 0 | norse-src-baldrs-draumar, norse-src-voluspa, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-14` | `baldr-ragnarok` | `baldrs-funeral` (P0)<br>`thor-and-jormungandr-final-battle` (P0)<br>`hermod-rides-to-hel` (P0)<br>`freyr-and-surtr` (P0) | 4 | 0 | norse-src-prose-edda-gylfaginning, norse-src-voluspa | 可领取 |
| `norse-review-15` | `baldr-ragnarok` | `heimdall-and-loki` (P0)<br>`ragnarok` (P0)<br>`vali-avenges-baldr` (P1)<br>`tyr-and-garmr` (P1) | 2 | 0 | norse-src-voluspa, norse-src-prose-edda-gylfaginning | 可领取 |
| `norse-review-16` | `volsung-cycle` | `volsung-and-sword-tree` (P0)<br>`signy-and-siggeir` (P0)<br>`sigurd-kills-fafnir` (P0)<br>`sigmund-and-sinfjotli` (P0) | 4 | 0 | norse-src-volsunga-saga, norse-src-fafnismal | 可领取 |
| `norse-review-17` | `volsung-cycle` | `sigurd-and-brynhildr` (P0)<br>`sigurd-and-regin` (P0)<br>`sigurds-death` (P0)<br>`andvari-gold` (P0) | 4 | 0 | norse-src-volsunga-saga, norse-src-reginsmal, norse-src-sigurdarkvida | 可领取 |
| `norse-review-18` | `volsung-cycle` | `sigmunds-death-and-hjordis` (P0)<br>`sigurd-and-sigrdrifa` (P0)<br>`gudrun-and-atli` (P0)<br>`gudrun-svanhild-hamdir-sorli` (P1) | 3 | 0 | norse-src-volsunga-saga, norse-src-sigrdrifumal, norse-src-atlakvida, norse-src-hamdismal | 可领取 |
| `norse-review-19` | `helgi-cycle` | `helgi-hundingsbani` (P1)<br>`helgi-hjorvardsson-and-svava` (P1)<br>`helgi-and-sigrun` (P1)<br>`helgi-burial-mound` (P1) | 0 | 0 | norse-src-helgakvida-hundingsbana-1, norse-src-helgakvida-hjorvardssonar, norse-src-helgakvida-hundingsbana-2 | 可领取 |
| `norse-review-20` | `independent-eddic` | `volundr-captive-smith` (P1)<br>`volundr-escape` (P1)<br>`svipdagr-and-mengloth` (P1)<br>`rig-and-social-orders` (P2) | 0 | 1 | norse-src-volundarkvida, norse-src-svipdagsmal, norse-src-rigsthula | 可领取 |
| `norse-review-21` | `independent-eddic` | `grottasongr` (P2) | 0 | 1 | norse-src-grottasongr | 可领取 |

## 视觉批次

- World 批次：8 个 World、16 个独立 AI 资产；当前 8 组齐备，0 组已批准。逐项记录见 `docs/NORSE_VISUAL_REVIEW_QUEUE.md`。
- Story 批次：74 个 key-moment 槽位；当前 74 个已归属，0 个已批准。逐项记录见 `docs/NORSE_STORY_VISUAL_REVIEW_QUEUE.md`。

## Phase 6 identity audit queue

> These records are machine-validated and ready for human source review. They do not carry an approval record yet.

- Status: needs-human-review · names 7 · interpretations 4 · claims 10 · contested claims 5

### Interpretations

- **Sigrdrífa 诗歌身份层** (`interpretation-norse-brynhildr-sigrdrifa`) · Character: `character-brynhildr` · confidence: contested
  - Sigrdrífa 作为来源限定的称谓与叙事身份层呈现；本包不把她静默建成独立于 Brynhildr 的第二个 Character，也不把所有布伦希尔德传统强行合并。
  - Sources: [norse-src-sigrdrifumal st. 1–4, 20–21](https://sacred-texts.com/neu/poe/poe25.htm)；[norse-src-helreid-brynhildar st. 6–10](https://sacred-texts.com/neu/poe/poe29.htm)
- **古尔薇格—海恩诗歌身份层** (`interpretation-norse-gullveig-heidr`) · Character: `character-gullveig` · confidence: contested
  - 古尔薇格与海恩在相邻诗节出现，但诗歌没有提供足够材料让产品把二者或古尔薇格与芙蕾雅无条件合并；页面应保留比较而非硬编码同一身份。
  - Sources: [norse-src-voluspa st. 21–24](https://sacred-texts.com/neu/poe/poe03.htm)
- **Rígr 社会秩序诗歌身份层** (`interpretation-norse-rigr-rigsthula`) · Character: `character-rigr` · confidence: contested
  - Rígr 只按《Rígsþula》的诗歌范围呈现；与 Heimdallr 或 Óðinn 的对应属于解释问题，不作为默认人物事实。
  - Sources: [norse-src-rigsthula sts. 1–49](https://sacred-texts.com/neu/poe/poe14.htm)
- **《英灵世系》历史化奥丁解释层** (`interpretation-norse-odin-ynglinga`) · Character: `character-odin` · confidence: medium
  - 《英灵世系》中的奥丁服务于中世纪王族谱系与历史化叙述；该解释层不能回填为所有北欧神话传统中的唯一奥丁传记。
  - Sources: [norse-src-ynglinga-saga chs. 2–7](https://sacred-texts.com/neu/heim/02ynglga.htm)

### Names

- **Óðinn** / Óðinn (`name-norse-odin-odinn`) · Character: `character-odin` · kind: primary · confidence: high · interpretation: base Character
  - Sources: [norse-src-voluspa st. 1–5](https://sacred-texts.com/neu/poe/poe03.htm)
- **Grímnir** / Grímnir (`name-norse-odin-grimnir`) · Character: `character-odin` · kind: title · confidence: high · interpretation: base Character
  - Sources: [norse-src-grimnismal st. 1–54](https://sacred-texts.com/neu/poe/poe06.htm)
- **Þórr** / Þórr (`name-norse-thor-thorr`) · Character: `character-thor` · kind: primary · confidence: high · interpretation: base Character
  - Sources: [norse-src-hymiskvida st. 1–39](https://sacred-texts.com/neu/poe/poe09.htm)
- **Sigrdrífa** / Sigrdrífa (`name-norse-brynhildr-sigrdrifa`) · Character: `character-brynhildr` · kind: literary-identity · confidence: contested · interpretation: interpretation-norse-brynhildr-sigrdrifa
  - Sources: [norse-src-sigrdrifumal st. 1–4](https://sacred-texts.com/neu/poe/poe25.htm)
- **Heiðr** / Heiðr (`name-norse-gullveig-heidr`) · Character: `character-gullveig` · kind: literary-identity · confidence: contested · interpretation: interpretation-norse-gullveig-heidr
  - Sources: [norse-src-voluspa st. 21–22](https://sacred-texts.com/neu/poe/poe03.htm)
- **Miðgarðsormr** / Midgard Serpent (`name-norse-jormungandr-midgardsormr`) · Character: `character-jormungandr` · kind: title · confidence: high · interpretation: base Character
  - Sources: [norse-src-prose-edda-gylfaginning ch. 34](https://sacred-texts.com/neu/pre/pre04.htm)
- **Fenrisúlfr** / Fenris-Wolf (`name-norse-fenrir-fenrisulfr`) · Character: `character-fenrir` · kind: title · confidence: high · interpretation: base Character
  - Sources: [norse-src-prose-edda-gylfaginning chs. 34, 51](https://sacred-texts.com/neu/pre/pre04.htm)

### Claims

- **claim-norse-ask-embla-triad** · contested · identity · subject: `story:story-ask-and-embla`
  - 《女预言家之歌》以奥丁、海尼尔与洛德尔描述赋予阿斯克与恩布拉生命和感知；散文创世叙事常以奥丁、威利与维组织平行版本。本包保留两种三元组，不把其中一种写成唯一诗句事实。
  - Tradition scope: Völuspá st. 17–18 versus Gylfaginning creation tradition
  - Sources: [norse-src-voluspa st. 17–18](https://sacred-texts.com/neu/poe/poe03.htm)；[norse-src-prose-edda-gylfaginning chs. 8–9](https://sacred-texts.com/neu/pre/pre04.htm)
- **claim-norse-harbard-identity** · contested · identity · subject: `story:story-thor-and-harbard`
  - 《哈巴德之歌》中的 Hárbarðr 身份必须保持来源限定；本包不把“Hárbarðr 必然等同奥丁”作为无争议人物事实。
  - Tradition scope: Hárbarðsljóð identity reading
  - Sources: [norse-src-harbardsljod st. 1–60](https://sacred-texts.com/neu/poe/poe08.htm)
- **claim-norse-sigrdrifa-brynhildr-boundary** · contested · identity · subject: `character:character-brynhildr`
  - Sigrdrífa 作为《Sigrdrífumál》中的称谓和身份层进入 Brynhildr 记录；她不应在没有说明来源范围的情况下被建成第二个角色，也不应覆盖全部布伦希尔德传统。
  - Tradition scope: Eddic heroic poetry and Völsung comparison
  - Sources: [norse-src-sigrdrifumal st. 1–4, 20–21](https://sacred-texts.com/neu/poe/poe25.htm)；[norse-src-helreid-brynhildar st. 6–10](https://sacred-texts.com/neu/poe/poe29.htm)
- **claim-norse-gullveig-freyja-boundary** · contested · identity · subject: `character:character-gullveig`
  - 古尔薇格与芙蕾雅的对应可以作为比较假说，但不能因《女预言家之歌》的相邻诗节或后世注释而自动建立 alias 或 same-as。
  - Tradition scope: Völuspá st. 21–24
  - Sources: [norse-src-voluspa st. 21–24](https://sacred-texts.com/neu/poe/poe03.htm)
- **claim-norse-garmr-fenrir-boundary** · supported · identity · subject: `character:character-garmr`
  - Garmr 与 Fenrir 在产品中保持两个 Character；即使《散文埃达》的诸神黄昏叙事把二者并置，也不将犬形守卫和巨狼静默合并。
  - Tradition scope: Gylfaginning Ragnarök sequence
  - Sources: [norse-src-prose-edda-gylfaginning chs. 34, 51](https://sacred-texts.com/neu/pre/pre04.htm)
- **claim-norse-ynglinga-euhemerism** · supported · interpretation · subject: `character:character-odin`
  - 《英灵世系》对奥丁的历史化与王权谱系叙述属于特定中世纪散文框架，不是对诗体埃达神格身份的无缝替代。
  - Tradition scope: Ynglinga saga / Heimskringla euhemeristic framing
  - Sources: [norse-src-ynglinga-saga chs. 2–7](https://sacred-texts.com/neu/heim/02ynglga.htm)；[norse-src-voluspa st. 1–5](https://sacred-texts.com/neu/poe/poe03.htm)
- **claim-norse-nine-worlds-model-boundary** · editorial-synthesis · interpretation · subject: `world:world-asgard`
  - 本包的八个 World 节点是当前故事依赖闭包与产品导航范围，不宣称已经固定完成一个跨所有来源一致的“九界”名单；未建模空间必须继续以来源为准。
  - Tradition scope: MythCanvas dependency model versus Eddic cosmological lists
  - Sources: [norse-src-voluspa st. 2](https://sacred-texts.com/neu/poe/poe03.htm)；[norse-src-prose-edda-gylfaginning chs. 8–9](https://sacred-texts.com/neu/pre/pre04.htm)
- **claim-norse-freyr-gerdr-consent-framing** · supported · interpretation · subject: `story:story-freyr-and-gerdr`
  - 《Skírnismál》的求婚、威胁和交换必须按诗歌中的权力关系呈现；页面不能把葛德简化成弗雷获得的奖品，也不能把强制性语言洗成无冲突的浪漫叙事。
  - Tradition scope: Skírnismál courtship tradition
  - Sources: [norse-src-skirnismal st. 1–42](https://sacred-texts.com/neu/poe/poe07.htm)
- **claim-norse-lokasenna-speech-acts** · supported · interpretation · subject: `story:story-lokis-feast`
  - 《洛基的争辩》中的辱骂和指控首先是宴席上的言语行动；页面不能把每句指控直接升级为已经核实的神谱或道德事实。
  - Tradition scope: Lokasenna flyting scene
  - Sources: [norse-src-lokasenna st. 1–65](https://sacred-texts.com/neu/poe/poe10.htm)
- **claim-norse-ragnarok-survivor-scope** · contested · narrative · subject: `story:story-ragnarok`
  - 诸神黄昏后的幸存者名单必须按具体来源呈现：诗歌、散文与后续重述的幸存者和复归次序不能无标记地拼成唯一版本。
  - Tradition scope: Völuspá final stanzas versus Gylfaginning chapters 52–53
  - Sources: [norse-src-voluspa st. 59–66](https://sacred-texts.com/neu/poe/poe03.htm)；[norse-src-prose-edda-gylfaginning chs. 52–53](https://sacred-texts.com/neu/pre/pre04.htm)

### Identity review record

- Snapshot version: norse-completion-snapshot-v2-efbe92674e040b87
- Reviewer type: pending
- Reviewer: pending
- Reviewed at: pending
- Decision: pending
- Unresolved issue IDs: pending

## 回写规则

- Story 来源审校：在 `src/content/norse/stories.ts` 写入 `editorialReview.status/reviewerType/reviewer/reviewedAt/sourceDecisionNotes/unresolvedIssueIds`；`reviewerType` 必须为 `human`，`sourceDecisionNotes` 至少一条非空结论，仅 `approved` 且无未决问题时把 `editorialStatus` 推进到 `source-reviewed`。
- World 视觉批准：在 `src/content/norse/assets.ts` 中为同一 World 的 desktop/mobile 两条 AI 资产分别写入 `reviewStatus: approved`、`reviewerType: human`、reviewer、日期和至少一条非空 `reviewNotes`；任一端不通过都保持 draft。
- Story 视觉批准：在 `src/data/story-illustrations.ts` 写入 provenance 的 `reviewStatus/reviewerType/reviewer/reviewedAt/reviewNotes`，其中 `reviewerType` 必须为 `human`，`reviewNotes` 至少一条非空结论；图像通过不等于正文来源审校通过。
- 产品签字：在 `src/content/norse/collection-signoff.ts` 写入带 `status/snapshotVersion/reviewerType: human/reviewer/signedAt/decisionNotes` 的产品签字记录；`snapshotVersion` 必须等于当前生成版本，报告会自动读取它，只有记录完整才会得到 `productSignoff: ready`，不得通过改报告文字伪造 gate。
- Phase 6 identity audit：在 `src/content/norse/collection-signoff.ts` 写入带 `status: approved/snapshotVersion: <当前生成版本>/reviewerType: human/reviewer/reviewedAt/decisionNotes/unresolvedIssueIds: []` 的独立记录；身份层变更后必须重新核对并更新该记录。
- Completion Snapshot 批准：在 `src/content/norse/collection-signoff.ts` 写入带 `status: approved/snapshotVersion: <当前生成版本>/reviewerType: human/reviewer/reviewedAt/decisionNotes/unresolvedIssueIds: []` 的独立记录；Snapshot reviewer 必须不同于 product sign-off reviewer；重新生成 Snapshot 后若版本变化，必须重新核对并更新该记录。
- 版本锁定顺序：先生成 Snapshot A，再写入身份/产品审批记录并生成 Snapshot B；若 B 与 A 不同，必须用 B 更新审批记录并重新生成，直到版本稳定后才能做最终 Snapshot approval。

## 单项签核模板

```text
Item / Cycle:
Reviewer type: human
Reviewer:
Reviewed at:
Snapshot version (when approving a Gate):
Decision: approved | changes-requested | excluded
Evidence / locator or asset checks:
Unresolved issue IDs:
Follow-up owner:
```

## 完成判定

- 本交接单不是完成认证；只有 Completion Snapshot 中 P0 来源、视觉、身份审计、交付、product sign-off 和独立 Snapshot approval 全部留痕后，Collection Discovery 才能从 blocked 转为可用。
- 本阶段不创建 Collection Manifest、Card Manifest、卡数、定价或稀有度。
