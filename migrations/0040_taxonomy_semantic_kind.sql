-- Keep the legacy CHECK-constrained `kind` column for compatibility. The
-- exact static taxonomy semantics live in `semantic_kind`; public pages never
-- depend on this D1 mirror.
ALTER TABLE taxonomy_terms ADD COLUMN semantic_kind TEXT;

CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_semantic_kind
  ON taxonomy_terms(mythology_id, semantic_kind, status, display_order);
