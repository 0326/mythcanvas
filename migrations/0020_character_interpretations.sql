-- Source-scoped Chinese mythology character identities.
-- Keeps a persistent Character distinct from historical/traditional
-- Interpretations, persistent Variants, rendering Styles, and output specs.

PRAGMA foreign_keys = ON;

-- Lightweight facets are useful on the stable Character record. Detailed and
-- claim-scoped source data belongs to character_interpretations/source refs.
ALTER TABLE characters ADD COLUMN character_type TEXT;
ALTER TABLE characters ADD COLUMN tradition_tags_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN source_periods_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN source_refs_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN editorial_collections_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE characters ADD COLUMN canonicality TEXT NOT NULL DEFAULT 'primary'
  CHECK (canonicality IN ('primary', 'layered', 'literary', 'contested'));

CREATE TABLE IF NOT EXISTS character_interpretations (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  tradition_tags_json TEXT NOT NULL DEFAULT '[]',
  source_periods_json TEXT NOT NULL DEFAULT '[]',
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  identity_anchors_json TEXT NOT NULL DEFAULT '[]',
  symbols_json TEXT NOT NULL DEFAULT '[]',
  canonical_design_overrides_json TEXT NOT NULL DEFAULT '{}',
  prompt_fragment TEXT NOT NULL DEFAULT '',
  confidence TEXT NOT NULL DEFAULT 'medium'
    CHECK (confidence IN ('high', 'medium', 'contested')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(character_id, slug),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_character_interpretations_character
  ON character_interpretations(character_id, status, created_at);

-- A name can be stable for the whole Character or limited to one interpretation.
-- This represents “二郎神 → 明清文学解释层 → 杨戬” without creating a
-- second Character or asserting the name in every tradition.
CREATE TABLE IF NOT EXISTS character_names (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  interpretation_id TEXT,
  name TEXT NOT NULL,
  name_en TEXT,
  name_kind TEXT NOT NULL
    CHECK (name_kind IN ('primary', 'alias', 'title', 'literary-identity')),
  is_primary_for_scope INTEGER NOT NULL DEFAULT 0
    CHECK (is_primary_for_scope IN (0, 1)),
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  confidence TEXT NOT NULL DEFAULT 'medium'
    CHECK (confidence IN ('high', 'medium', 'contested')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(character_id, interpretation_id, name),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (interpretation_id) REFERENCES character_interpretations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_character_names_lookup
  ON character_names(name, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_character_names_scope
  ON character_names(character_id, IFNULL(interpretation_id, ''), name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_character_names_primary_scope
  ON character_names(character_id, IFNULL(interpretation_id, ''))
  WHERE is_primary_for_scope = 1 AND status = 'active';

-- Concepts allow sourced Character relations such as “女娲 → 天地秩序”
-- without pretending that an abstract concept is another Character.
CREATE TABLE IF NOT EXISTS content_concepts (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS character_relations (
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
      'syncretized-with', 'associated-with', 'created', 'transformed-into'
    )),
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

CREATE INDEX IF NOT EXISTS idx_character_relations_from
  ON character_relations(from_character_id, status);
CREATE INDEX IF NOT EXISTS idx_character_relations_to_character
  ON character_relations(to_character_id, status);
CREATE INDEX IF NOT EXISTS idx_character_relations_to_concept
  ON character_relations(to_concept_id, status);

-- A Variant may be general to the Character or scoped to one Interpretation.
ALTER TABLE character_variants ADD COLUMN character_interpretation_id TEXT
  REFERENCES character_interpretations(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_character_variants_interpretation
  ON character_variants(character_interpretation_id);

-- Reference images can refine an interpretation while remaining owned by the
-- Character or Variant. This avoids rebuilding the existing owner-type CHECK.
ALTER TABLE reference_assets ADD COLUMN character_interpretation_id TEXT
  REFERENCES character_interpretations(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_reference_assets_interpretation
  ON reference_assets(character_interpretation_id, status);

-- Source interpretation is part of reproducible generation provenance.
ALTER TABLE generation_jobs ADD COLUMN character_interpretation_id TEXT
  REFERENCES character_interpretations(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_generation_jobs_interpretation
  ON generation_jobs(character_interpretation_id);

-- SQLite cannot express these cross-table ownership rules with a column CHECK.
-- Enforce them at the persistence boundary so imports and admin APIs cannot
-- attach a source-scoped record to another Character's interpretation.
CREATE TRIGGER IF NOT EXISTS validate_character_name_interpretation_insert
BEFORE INSERT ON character_names
FOR EACH ROW WHEN NEW.interpretation_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.interpretation_id AND character_id = NEW.character_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_names interpretation must belong to character');
END;

CREATE TRIGGER IF NOT EXISTS validate_character_name_interpretation_update
BEFORE UPDATE ON character_names
FOR EACH ROW WHEN NEW.interpretation_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.interpretation_id AND character_id = NEW.character_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_names interpretation must belong to character');
END;

CREATE TRIGGER IF NOT EXISTS validate_variant_interpretation_insert
BEFORE INSERT ON character_variants
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.character_interpretation_id AND character_id = NEW.character_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_variants interpretation must belong to character');
END;

CREATE TRIGGER IF NOT EXISTS validate_variant_interpretation_update
BEFORE UPDATE ON character_variants
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM character_interpretations
    WHERE id = NEW.character_interpretation_id AND character_id = NEW.character_id
  )
BEGIN
  SELECT RAISE(ABORT, 'character_variants interpretation must belong to character');
END;

CREATE TRIGGER IF NOT EXISTS validate_reference_asset_interpretation_insert
BEFORE INSERT ON reference_assets
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND (
    NEW.owner_type = 'style'
    OR (NEW.owner_type = 'character' AND NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.character_interpretation_id AND character_id = NEW.owner_id
    ))
    OR (NEW.owner_type = 'character_variant' AND NOT EXISTS (
      SELECT 1
      FROM character_variants AS variant
      JOIN character_interpretations AS interpretation ON interpretation.character_id = variant.character_id
      WHERE variant.id = NEW.owner_id
        AND interpretation.id = NEW.character_interpretation_id
        AND (variant.character_interpretation_id IS NULL
          OR variant.character_interpretation_id = NEW.character_interpretation_id)
    ))
  )
BEGIN
  SELECT RAISE(ABORT, 'reference_assets interpretation must match its character scope');
END;

CREATE TRIGGER IF NOT EXISTS validate_reference_asset_interpretation_update
BEFORE UPDATE ON reference_assets
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND (
    NEW.owner_type = 'style'
    OR (NEW.owner_type = 'character' AND NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.character_interpretation_id AND character_id = NEW.owner_id
    ))
    OR (NEW.owner_type = 'character_variant' AND NOT EXISTS (
      SELECT 1
      FROM character_variants AS variant
      JOIN character_interpretations AS interpretation ON interpretation.character_id = variant.character_id
      WHERE variant.id = NEW.owner_id
        AND interpretation.id = NEW.character_interpretation_id
        AND (variant.character_interpretation_id IS NULL
          OR variant.character_interpretation_id = NEW.character_interpretation_id)
    ))
  )
BEGIN
  SELECT RAISE(ABORT, 'reference_assets interpretation must match its character scope');
END;

CREATE TRIGGER IF NOT EXISTS validate_generation_job_interpretation_insert
BEFORE INSERT ON generation_jobs
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND (
    NEW.entity_type != 'character'
    OR NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.character_interpretation_id AND character_id = NEW.entity_id
    )
  )
BEGIN
  SELECT RAISE(ABORT, 'generation_jobs interpretation must belong to character entity');
END;

CREATE TRIGGER IF NOT EXISTS validate_generation_job_interpretation_update
BEFORE UPDATE ON generation_jobs
FOR EACH ROW WHEN NEW.character_interpretation_id IS NOT NULL
  AND (
    NEW.entity_type != 'character'
    OR NOT EXISTS (
      SELECT 1 FROM character_interpretations
      WHERE id = NEW.character_interpretation_id AND character_id = NEW.entity_id
    )
  )
BEGIN
  SELECT RAISE(ABORT, 'generation_jobs interpretation must belong to character entity');
END;

CREATE TRIGGER IF NOT EXISTS validate_character_relation_interpretations_insert
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

CREATE TRIGGER IF NOT EXISTS validate_character_relation_interpretations_update
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
