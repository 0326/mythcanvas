-- A relationship graph needs sourced narrative edges as well as genealogy.
-- SQLite cannot alter a CHECK constraint in place, so rebuild the table while
-- preserving every existing assertion and all source/interpretation columns.

CREATE TABLE character_relations__narrative_types (
  id TEXT PRIMARY KEY,
  from_character_id TEXT NOT NULL,
  to_character_id TEXT,
  to_concept_id TEXT,
  from_interpretation_id TEXT,
  to_interpretation_id TEXT,
  relation_type TEXT NOT NULL
    CHECK (relation_type IN (
      'parent', 'child', 'consort', 'sibling', 'master', 'disciple',
      'ally', 'rival', 'enemy', 'serves', 'rules-over',
      'syncretized-with', 'associated-with', 'created', 'transformed-into',
      'punishes', 'orders-creation', 'defeats', 'exchanges-with', 'opposes',
      'captures', 'aids', 'rides', 'companion', 'encounters', 'resists',
      'departs-from'
    )),
  assertion_key TEXT NOT NULL DEFAULT '',
  tradition_scope TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 1 CHECK (is_default IN (0, 1)),
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  confidence TEXT NOT NULL DEFAULT 'medium'
    CHECK (confidence IN ('high', 'medium', 'contested')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (to_character_id IS NOT NULL AND to_concept_id IS NULL)
    OR (to_character_id IS NULL AND to_concept_id IS NOT NULL)
  ),
  FOREIGN KEY (from_character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (to_character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (to_concept_id) REFERENCES content_concepts(id) ON DELETE CASCADE,
  FOREIGN KEY (from_interpretation_id) REFERENCES character_interpretations(id) ON DELETE CASCADE,
  FOREIGN KEY (to_interpretation_id) REFERENCES character_interpretations(id) ON DELETE CASCADE
);

INSERT INTO character_relations__narrative_types (
  id, from_character_id, to_character_id, to_concept_id,
  from_interpretation_id, to_interpretation_id, relation_type,
  assertion_key, tradition_scope, is_default, source_refs_json, confidence,
  status, created_at, updated_at
)
SELECT
  id, from_character_id, to_character_id, to_concept_id,
  from_interpretation_id, to_interpretation_id, relation_type,
  assertion_key, tradition_scope, is_default, source_refs_json, confidence,
  status, created_at, updated_at
FROM character_relations;

DROP TABLE character_relations;
ALTER TABLE character_relations__narrative_types RENAME TO character_relations;

CREATE INDEX idx_character_relations_from
  ON character_relations(from_character_id, status);
CREATE INDEX idx_character_relations_to_character
  ON character_relations(to_character_id, status);
CREATE INDEX idx_character_relations_to_concept
  ON character_relations(to_concept_id, status);
CREATE UNIQUE INDEX idx_character_relations_canonical_assertion
  ON character_relations(
    from_character_id,
    IFNULL(to_character_id, ''),
    IFNULL(to_concept_id, ''),
    IFNULL(from_interpretation_id, ''),
    IFNULL(to_interpretation_id, ''),
    relation_type,
    tradition_scope
  ) WHERE status = 'active';
CREATE INDEX idx_character_relations_default
  ON character_relations(from_character_id, is_default, status);

CREATE TRIGGER validate_character_relation_interpretations_insert
BEFORE INSERT ON character_relations
FOR EACH ROW WHEN (
  (NEW.from_interpretation_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.from_interpretation_id AND character_id = NEW.from_character_id
  ))
  OR (NEW.to_interpretation_id IS NOT NULL AND (
    NEW.to_character_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.to_interpretation_id AND character_id = NEW.to_character_id
    )
  ))
)
BEGIN
  SELECT RAISE(ABORT, 'character_relations interpretation must match relation endpoint');
END;

CREATE TRIGGER validate_character_relation_interpretations_update
BEFORE UPDATE ON character_relations
FOR EACH ROW WHEN (
  (NEW.from_interpretation_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.from_interpretation_id AND character_id = NEW.from_character_id
  ))
  OR (NEW.to_interpretation_id IS NOT NULL AND (
    NEW.to_character_id IS NULL OR NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.to_interpretation_id AND character_id = NEW.to_character_id
    )
  ))
)
BEGIN
  SELECT RAISE(ABORT, 'character_relations interpretation must match relation endpoint');
END;

CREATE TRIGGER validate_character_relation_same_mythology_insert
BEFORE INSERT ON character_relations
FOR EACH ROW WHEN NEW.to_character_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM characters AS source
    JOIN characters AS target ON target.id = NEW.to_character_id
    WHERE source.id = NEW.from_character_id
      AND source.mythology_id = target.mythology_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_relations endpoints must share mythology');
END;

CREATE TRIGGER validate_character_relation_same_mythology_update
BEFORE UPDATE OF from_character_id, to_character_id ON character_relations
FOR EACH ROW WHEN NEW.to_character_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM characters AS source
    JOIN characters AS target ON target.id = NEW.to_character_id
    WHERE source.id = NEW.from_character_id
      AND source.mythology_id = target.mythology_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_relations endpoints must share mythology');
END;
