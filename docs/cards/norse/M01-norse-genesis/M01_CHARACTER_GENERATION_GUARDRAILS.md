# M01 Character Generation Guardrails

> Scope: `cards/1003010001.json` – `1003010016.json`  
> Status: Normative  
> Version: V1.0

## 1. JSON first

角色出图必须按：来源核对 → 单卡 JSON review → 差异化 review → 裁切安全 review → Prompt review → 出图 → 用户确认 → 回写 `prompt.final / generation / qa`。

未确认图片不得自动标记 `approved`。

## 2. 来源事实与艺术解释分离

每张角色 JSON 必须区分：

- `canon.sourceBoundFacts`
- `canon.interpretationNotes`

文本没有说的内容，不得因为大众影视印象而写成 Canon。词源、现代解释、常见二创都只能标记为 interpretation。

典型例子：

- Búri 的来源重点是从咸冰中显现、俊美、伟岸、强壮，不是白发霜巨人。
- Urðr / Verðandi / Skuld 的过去/现在/未来映射只能作视觉联想，不能当成 `Völuspá` st.20 的明确外观事实。
- Ask / Embla 不得因为木材关联画成树人/树妖。
- Níðhöggr 不得默认成现代西方有翼喷火巨龙。

## 3. 先锁定故事状态

`canon.worldState` 是角色出图硬约束。

- Ymir 活着时：不得出现由其身体形成后的山川、海洋、成熟天空或地球。
- Odin · Creator：不得自动导入后期独眼神王、Gungnir、乌鸦、Valhalla、王座等完整 M02+ 视觉包；若刻意跨阶段使用，必须显式标注为有意的视觉时代错置。
- Sköll / Hati：追逐仍在进行，不得提前画成已吞噬日月。

## 4. 差异化是硬 Gate

生成前必须读取 `canon.differentiation.fromCardIds` 并比较：脸型、年龄、体量、轮廓、发型、胡须、服装、姿势、镜头、背景结构、主光和特效语言。

失败示例：

- Búri = 第二个 Ymir
- Vili = Odin 换脸
- Vé = Vili 换姿势
- 三位 Norn = 同脸换色
- Hati = 蓝色 Sköll

系列一致性 = 共用 Art Direction，不等于复制人物模板。

## 5. 神话感来自神话本身

不要靠发光符文、重甲、银河、浮石、晶体、粒子和蓝橙大片调色把普通主体“神话化”。

优先使用真正的叙事识别点：

- Ymir → 冰火交汇中的世界级原初巨人
- Auðumbla → 原初巨型供养者
- Búri → 从咸冰显现的俊美伟岸祖先
- Ask / Embla → 第一次获得生命与感知的人类
- Norns → 泉与树根旁的命运工作
- Sól / Máni → 天体有序运行
- Sköll / Hati → 日月追逐
- Níðhöggr → 啃噬世界树根

## 6. 裁切安全

角色核心身份默认：X 22%–78%，Y 12%–52%；底部 Y 70%–100% 可牺牲；左右约 12% 可裁。

脸、角、耳朵、发型、关键手部和身份符号不得贴边。Auðumbla 第一版的头角贴边是标准反例。

## 7. 主体强于背景

一级细节：脸 / 身份 / 动作；二级：身体 / 近身材质；三级：背景。

默认禁止：`hyper-detailed-everything`、通用蓝橙大片分割、过量粒子、浮石壁纸、glossy game-CG、装饰性宇宙堆料。

## 8. Approval discipline

只有用户明确确认的图片才能设置：

```text
generation.status = approved
qa.status = approved
prompt.final != null
referenceImageFile = <cardId>.png
```

被否决图片要把教训写进 `generation.notes / prompt.notes / canon.mustAvoid / differentiation`，但不得自动成为 Canon reference。

## 9. Pre-generation checklist

每次出图前必须逐项检查：

```text
[ ] 来源事实已核对
[ ] interpretation 与 fact 已分离
[ ] worldState 正确
[ ] 没有提前导入后续阶段属性
[ ] 与 fromCardIds 的视觉差异已检查
[ ] 头脸/身份符号满足裁切安全
[ ] 主体复杂度高于背景
[ ] 已移除通用 AI Fantasy 装饰
[ ] JSON 已 review 后再生成
```
