# M01 Per-Card JSON

本目录中的每个 JSON 文件对应一张卡，是该卡片数据的唯一真源。

```text
1003010001.json ↔ 1003010001.webp
1003010002.json ↔ 1003010002.webp
...
1003010050.json ↔ 1003010050.webp
```

规则：

1. 图片确认前，`prompt.final = null`，`qa.status = planned / prompt-ready`；
2. 一旦某张图片被确认，必须把**实际可重放的完整提示词**写入该卡 `prompt.final`；
3. 同时更新 `generation.status = approved`、`generation.attempt`、`generation.notes` 和 `qa`；
4. 后续重画只更新该卡 JSON，不修改其他卡；
5. PNG 保留为本地生产母版；网站交付图使用同编号 WebP，二进制上传 R2 后通过 `output.assetKey` 与 `/media/<R2-key>` 引用；
6. `M01_CARD_DATA.json` 只保存系列级公共信息与 50 个 Card ID 索引，不再保存所有卡片详情。

当前状态：

- `1003010001`–`1003010050` 已于 2026-09-11 确认为完整 M01 系列；
- 50 张网站交付图均为 WebP，原始 PNG 母版继续在本地保留；PNG 与 WebP 二进制均不进入 Git；
- 第 49、50 张为 16:9 横版系列封面，其余 48 张为竖版收藏卡。
