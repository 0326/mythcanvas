-- 0015_world_id_normalization.sql
-- Remove the legacy `realm-*` identifier prefix after the World schema cutover.
--
-- Slugs and public URLs are unchanged. IDs are internal identifiers, so all
-- relational references are updated in the same migration. The deferred
-- foreign-key check allows the parent key and its references to move together.

PRAGMA foreign_keys = ON;
PRAGMA defer_foreign_keys = ON;

UPDATE worlds
SET id = REPLACE(id, 'realm-', 'world-')
WHERE id LIKE 'realm-%';

UPDATE character_worlds
SET world_id = REPLACE(world_id, 'realm-', 'world-')
WHERE world_id LIKE 'realm-%';

UPDATE scenes
SET world_id = REPLACE(world_id, 'realm-', 'world-')
WHERE world_id LIKE 'realm-%';

UPDATE artworks
SET world_id = REPLACE(world_id, 'realm-', 'world-')
WHERE world_id LIKE 'realm-%';

UPDATE generation_jobs
SET entity_id = REPLACE(entity_id, 'realm-', 'world-')
WHERE entity_type = 'world'
  AND entity_id LIKE 'realm-%';

UPDATE favorites
SET target_id = REPLACE(target_id, 'realm-', 'world-')
WHERE target_type = 'world'
  AND target_id LIKE 'realm-%';

-- analytics_events has no target_type column. A realm-prefixed target ID is
-- unambiguous here because world IDs are the only domain IDs with this prefix.
UPDATE analytics_events
SET target_id = REPLACE(target_id, 'realm-', 'world-')
WHERE target_id LIKE 'realm-%';
