-- Static content remains the canonical source. These tables mirror the new
-- structured fields for operational/admin use and must not become a public
-- runtime dependency.

ALTER TABLE content_sources ADD COLUMN source_family TEXT;
ALTER TABLE content_sources ADD COLUMN evidence_roles_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE content_sources ADD COLUMN manuscript_context TEXT;
ALTER TABLE content_sources ADD COLUMN region TEXT;

CREATE TABLE IF NOT EXISTS mythic_objects (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  native_name TEXT,
  aliases_json TEXT NOT NULL DEFAULT '[]',
  object_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  tradition_tags_json TEXT NOT NULL DEFAULT '[]',
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  canonical_design_json TEXT NOT NULL,
  hero_src TEXT,
  hero_alt TEXT,
  hero_width INTEGER,
  hero_height INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  UNIQUE(mythology_id, slug),
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_mythic_objects_mythology ON mythic_objects(mythology_id, status, name);

CREATE TABLE IF NOT EXISTS content_relations (
  id TEXT PRIMARY KEY,
  mythology_id TEXT NOT NULL,
  from_type TEXT NOT NULL,
  from_id TEXT NOT NULL,
  to_type TEXT NOT NULL,
  to_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  tradition_scope TEXT NOT NULL DEFAULT '',
  confidence TEXT NOT NULL,
  source_refs_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  UNIQUE(mythology_id, from_type, from_id, to_type, to_id, relation_type, tradition_scope),
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_content_relations_from ON content_relations(mythology_id, from_type, from_id, status);
CREATE INDEX IF NOT EXISTS idx_content_relations_to ON content_relations(mythology_id, to_type, to_id, status);
