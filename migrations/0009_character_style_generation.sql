-- Character / Style / OutputSpec generation system
-- Keeps Character identity, persistent variants, rendering Style, and device output orthogonal.
-- Depends on migrations 0001-0008.

PRAGMA foreign_keys = ON;

-- 1. Persistent Character variants: age / costume / form are NOT rendering styles.
CREATE TABLE IF NOT EXISTS character_variants (
  id TEXT PRIMARY KEY,
  character_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('age','costume','form','composite')),
  description TEXT NOT NULL DEFAULT '',
  traits_json TEXT NOT NULL DEFAULT '{}',
  identity_overrides_json TEXT NOT NULL DEFAULT '[]',
  prompt_fragment TEXT NOT NULL DEFAULT '',
  reference_pack_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(character_id, slug),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_character_variants_character ON character_variants(character_id);
CREATE INDEX IF NOT EXISTS idx_character_variants_status ON character_variants(status);

-- 2. Expand Style from a short hint into an editable production rendering profile.
ALTER TABLE styles ADD COLUMN category TEXT NOT NULL DEFAULT 'general';
ALTER TABLE styles ADD COLUMN prompt_template TEXT NOT NULL DEFAULT '';
ALTER TABLE styles ADD COLUMN render_rules_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE styles ADD COLUMN avoid_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE styles ADD COLUMN status TEXT NOT NULL DEFAULT 'active';

UPDATE styles
SET category='canonical',
    prompt_template='Render as the stable MythCanvas canonical interpretation: culturally grounded, refined, timeless, clear in silhouette, and visually premium without borrowing a modern franchise design.',
    render_rules_json='["preserve canonical identity","culturally grounded materials","clear readable silhouette","premium restrained finish"]',
    avoid_json='["generic AI fantasy redesign","modern franchise-specific costume","unmotivated visual effects"]'
WHERE id='canonical';

UPDATE styles
SET category='cinematic',
    prompt_template='Render with premium cinematic fantasy realism, atmospheric depth, refined material response, deliberate camera staging, and dramatic but elegant lighting.',
    render_rules_json='["cinematic depth","realistic material response","controlled dramatic light","strong focal hierarchy"]',
    avoid_json='["game UI splash screen","excessive bloom","random particles","plastic AI sheen"]'
WHERE id='cinematic';

UPDATE styles
SET category='sacred',
    prompt_template='Render with a luminous ceremonial atmosphere, quiet divine presence, restrained sacred light, elegant symmetry, and refined mythological materials.',
    render_rules_json='["ceremonial composition","controlled sacred glow","quiet divine presence","refined symbolic detail"]',
    avoid_json='["overexposed white glow","generic angel imagery","ornament overload"]'
WHERE id='sacred';

UPDATE styles
SET category='illustration',
    prompt_template='Render as a refined anime illustration with disciplined line work, a clean readable silhouette, expressive but coherent facial design, restrained gradients, and polished key-visual finishing.',
    render_rules_json='["clean line hierarchy","readable silhouette","expressive coherent face","controlled cel and gradient rendering"]',
    avoid_json='["chibi unless requested","generic school-anime costume","overlarge eyes that destroy identity","flat empty background"]'
WHERE id='anime';

UPDATE styles
SET category='fantasy',
    prompt_template='Render as solemn dark fantasy with mysterious atmospheric depth, restrained contrast, weathered mythological materials, and monumental presence without horror or gore.',
    render_rules_json='["solemn atmosphere","weathered materials","deep spatial layering","restrained dramatic contrast"]',
    avoid_json='["gore","horror clichés","black-metal gothic styling","muddy unreadable silhouette"]'
WHERE id='dark-fantasy';

UPDATE styles
SET category='speculative',
    prompt_template='Render as Cyber Myth: fuse restrained futuristic materials, luminous geometry, and advanced light into the existing mythological design while preserving its cultural identity and recognizable silhouette.',
    render_rules_json='["mythology-first silhouette","restrained luminous geometry","premium future materials","technology integrated into existing symbols"]',
    avoid_json='["generic neon city cyberpunk","random cables","full identity redesign","technology replacing cultural motifs"]'
WHERE id='cyber-myth';

-- 3. Device/output composition is its own reusable dimension.
CREATE TABLE IF NOT EXISTS output_specs (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop','mobile')),
  aspect_ratio TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  draft_width INTEGER NOT NULL,
  draft_height INTEGER NOT NULL,
  safe_zone_json TEXT NOT NULL DEFAULT '{}',
  composition_rules_json TEXT NOT NULL DEFAULT '[]',
  default_quality TEXT NOT NULL DEFAULT 'high' CHECK (default_quality IN ('low','medium','high','auto')),
  output_format TEXT NOT NULL DEFAULT 'png' CHECK (output_format IN ('png','jpeg','webp')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO output_specs (
  id, slug, name, device_type, aspect_ratio, width, height, draft_width, draft_height,
  safe_zone_json, composition_rules_json, default_quality, output_format
) VALUES
(
  'desktop-wallpaper', 'desktop-wallpaper', 'PC 壁纸', 'desktop', '16:9',
  2560, 1440, 1280, 720,
  '{"edgePaddingPct":4,"preferredNegativeSpace":"left-or-right"}',
  '["preserve wide environmental storytelling","keep the primary subject away from extreme crop edges","maintain a readable focal hierarchy at desktop scale","leave usable negative space when the scene permits"]',
  'high', 'png'
),
(
  'mobile-wallpaper', 'mobile-wallpaper', '手机壁纸', 'mobile', '9:16',
  1440, 2560, 720, 1280,
  '{"topReservedPct":14,"bottomReservedPct":8,"horizontalPaddingPct":6}',
  '["keep key facial details below the extreme top edge","preserve breathing room for lock-screen time/status UI","use a clear vertical subject silhouette","keep signature props away from the extreme bottom edge"]',
  'high', 'png'
);

-- 4. Reference assets live in R2; D1 stores structured ownership/provenance.
CREATE TABLE IF NOT EXISTS reference_assets (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('character','character_variant','style')),
  owner_id TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'portrait-front','portrait-three-quarter','fullbody-front','fullbody-three-quarter',
    'turnaround','expression-sheet','signature-props','style-reference','moodboard'
  )),
  asset_key TEXT NOT NULL,
  asset_mime TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL DEFAULT 'ai',
  license TEXT NOT NULL DEFAULT '',
  generation_meta_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reference_assets_owner ON reference_assets(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_reference_assets_type ON reference_assets(asset_type);

-- 5. Generation recipe provenance. Existing ratio/composition fields remain for compatibility.
ALTER TABLE generation_jobs ADD COLUMN character_variant_id TEXT;
ALTER TABLE generation_jobs ADD COLUMN output_spec_id TEXT;
ALTER TABLE generation_jobs ADD COLUMN prompt_layers_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE generation_jobs ADD COLUMN generation_model TEXT;
ALTER TABLE generation_jobs ADD COLUMN generation_quality TEXT;
ALTER TABLE generation_jobs ADD COLUMN reference_asset_ids_json TEXT NOT NULL DEFAULT '[]';

CREATE INDEX IF NOT EXISTS idx_generation_jobs_variant ON generation_jobs(character_variant_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_output_spec ON generation_jobs(output_spec_id);
