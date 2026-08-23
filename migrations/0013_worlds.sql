-- 0013_worlds.sql
-- 将旧 realm 命名空间迁移到 world 命名空间。
--
-- 背景：早期迁移把"世界"实体命名为 realms（表 realms / character_realms，列 realm_id）。
-- 代码在 "rename realm to world" 提交后查询 worlds / character_worlds / world_id，
-- 导致线上/本地 D1（仍为老 realm schema）出现 no such table / no such column 报错。
--
-- 本迁移在本地与远端 D1 上增量执行（不可重复执行；失败事务自动回滚）：
--   1. realms              -> worlds
--   2. character_realms    -> character_worlds（realm_id -> world_id）
--   3. scenes.realm_id     -> world_id
--   4. artworks.realm_id   -> world_id
--
-- 行为说明：
--   - ALTER TABLE ... RENAME COLUMN 会同步更新表内引用该列的外键 from 列；
--   - ALTER TABLE ... RENAME（表名）会自动将其他表中指向原表名的外键引用一并改名为新表名。
--   - 本迁移不改变主键/关联字段"值"（如 id 仍可能是 realm-xxx 前缀）。
--     应用只按 id 值做外键/关联一致匹配，页面 URL 均基于 slug；因此无需改写值，
--     也避免对已有关联行触发外键约束冲突。若后续需要统一为 world- 前缀，
--     应由应用层数据迁移另行做（本文件只负责 schema 命名对齐）。
--
-- 注意：hero/portrait 缺列补齐不在此文件（因部分环境列已存在、缺失部分靠
--   独立远端指令补入），详见迁移后的补充命令。

ALTER TABLE realms RENAME TO worlds;

ALTER TABLE character_realms RENAME TO character_worlds;

ALTER TABLE character_worlds RENAME COLUMN realm_id TO world_id;

ALTER TABLE scenes RENAME COLUMN realm_id TO world_id;

ALTER TABLE artworks RENAME COLUMN realm_id TO world_id;