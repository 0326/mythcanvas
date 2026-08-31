-- Greek mythology content graph foundations.
-- Editorial Story bodies remain versioned source files; these tables hold the
-- queryable claims, taxonomy and relationship assertions that support D1 pages.

CREATE TABLE IF NOT EXISTS content_sources (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  source_type TEXT NOT NULL,
  tradition TEXT,
  period TEXT,
  language TEXT,
  edition TEXT,
  url TEXT,
  license_note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_content_sources_mythology ON content_sources(mythology_id, status, title);

CREATE TABLE IF NOT EXISTS content_claims (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('character', 'world', 'scene', 'story', 'relation', 'visual-anchor')),
  subject_id TEXT NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('identity', 'genealogy', 'narrative', 'interpretation', 'visual-anchor')),
  summary TEXT NOT NULL,
  claim_status TEXT NOT NULL CHECK (claim_status IN ('supported', 'contested', 'editorial-synthesis')),
  tradition_scope TEXT NOT NULL DEFAULT '',
  publish_status TEXT NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft', 'published', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_content_claims_subject ON content_claims(subject_type, subject_id, publish_status);

CREATE TABLE IF NOT EXISTS content_claim_sources (
  claim_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  locator TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (claim_id, source_id, locator),
  FOREIGN KEY (claim_id) REFERENCES content_claims(id) ON DELETE CASCADE,
  FOREIGN KEY (source_id) REFERENCES content_sources(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS taxonomy_terms (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('lineage', 'domain', 'story-cycle', 'editorial-collection')),
  name TEXT NOT NULL,
  name_en TEXT,
  summary TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  UNIQUE(mythology_id, slug),
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS character_taxonomy_terms (
  character_id TEXT NOT NULL,
  taxonomy_term_id TEXT NOT NULL,
  PRIMARY KEY (character_id, taxonomy_term_id),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
  FOREIGN KEY (taxonomy_term_id) REFERENCES taxonomy_terms(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_character_taxonomy_terms_term ON character_taxonomy_terms(taxonomy_term_id, character_id);

CREATE TABLE IF NOT EXISTS world_relations (
  id TEXT PRIMARY KEY,
  from_world_id TEXT NOT NULL,
  to_world_id TEXT NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('contains', 'adjacent-to', 'connected-to', 'contrasts-with')),
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  UNIQUE(from_world_id, to_world_id, relation_type),
  FOREIGN KEY (from_world_id) REFERENCES worlds(id) ON DELETE CASCADE,
  FOREIGN KEY (to_world_id) REFERENCES worlds(id) ON DELETE CASCADE
);

ALTER TABLE character_relations ADD COLUMN assertion_key TEXT NOT NULL DEFAULT '';
ALTER TABLE character_relations ADD COLUMN tradition_scope TEXT NOT NULL DEFAULT '';
ALTER TABLE character_relations ADD COLUMN is_default INTEGER NOT NULL DEFAULT 1 CHECK (is_default IN (0, 1));

CREATE UNIQUE INDEX IF NOT EXISTS idx_character_relations_canonical_assertion
  ON character_relations(
    from_character_id,
    IFNULL(to_character_id, ''),
    IFNULL(to_concept_id, ''),
    IFNULL(from_interpretation_id, ''),
    IFNULL(to_interpretation_id, ''),
    relation_type,
    tradition_scope
  ) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_character_relations_default
  ON character_relations(from_character_id, is_default, status);

-- Relationship endpoints and their interpretations must belong to the same
-- mythology. SQLite foreign keys cannot express that cross-table invariant.
CREATE TRIGGER IF NOT EXISTS validate_character_relation_same_mythology_insert
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

CREATE TRIGGER IF NOT EXISTS validate_character_relation_same_mythology_update
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
