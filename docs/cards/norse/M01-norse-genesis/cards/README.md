# M01 Per-Card JSON

本目录中的每个 JSON 文件对应一张卡，是该卡片数据的唯一真源。

```text
1003010001.json ↔ 1003010001.png
1003010002.json ↔ 1003010002.png
...
1003010050.json ↔ 1003010050.png
```

规则：

1. 图片确认前，`prompt.final = null`，`qa.status = planned / prompt-ready`；
2. 一旦某张图片被确认，必须把**实际可重放的完整提示词**写入该卡 `prompt.final`；
3. 同时更新 `generation.status = approved`、`generation.attempt`、`generation.notes` 和 `qa`；
4. 后续重画只更新该卡 JSON，不修改其他卡；
5. 图片下载后必须使用与 JSON 相同的 10 位 Card ID 文件名；
6. `M01_CARD_DATA.json` 只保存系列级公共信息与 50 个 Card ID 索引，不再保存所有卡片详情。

当前已确认：

- `1003010001` — Ymir / 尤弥尔：已写入 approved 详细 Prompt。
