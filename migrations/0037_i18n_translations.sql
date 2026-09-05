-- 0037_i18n_translations.sql
--
-- Introduce locale-scoped reader-facing translations without removing the legacy
-- name/name_en/summary columns. Repositories can migrate incrementally and the
-- existing production read path remains valid during rollout.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS mythology_translations (
  mythology_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  hero_alt TEXT,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (translation_status IN ('draft','machine','reviewed','published')),
  source_locale TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (mythology_id, locale),
  FOREIGN KEY (mythology_id) REFERENCES mythologies(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_mythology_translations_locale_status
  ON mythology_translations(locale, translation_status);

CREATE TABLE IF NOT EXISTS world_translations (
  world_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  hero_alt TEXT,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (translation_status IN ('draft','machine','reviewed','published')),
  source_locale TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (world_id, locale),
  FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_world_translations_locale_status
  ON world_translations(locale, translation_status);

CREATE TABLE IF NOT EXISTS scene_translations (
  scene_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  hero_alt TEXT,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (translation_status IN ('draft','machine','reviewed','published')),
  source_locale TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (scene_id, locale),
  FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_scene_translations_locale_status
  ON scene_translations(locale, translation_status);

CREATE TABLE IF NOT EXISTS character_translations (
  character_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  portrait_alt TEXT,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (translation_status IN ('draft','machine','reviewed','published')),
  source_locale TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (character_id, locale),
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_character_translations_locale_status
  ON character_translations(locale, translation_status);

CREATE TABLE IF NOT EXISTS style_translations (
  style_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  translation_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (translation_status IN ('draft','machine','reviewed','published')),
  source_locale TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (style_id, locale),
  FOREIGN KEY (style_id) REFERENCES styles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_style_translations_locale_status
  ON style_translations(locale, translation_status);

-- Existing reader-facing Chinese content is the authoritative default locale.
INSERT OR IGNORE INTO mythology_translations (
  mythology_id, locale, name, tagline, summary, hero_alt, translation_status, source_locale
)
SELECT id, 'zh-Hans', name, tagline, summary, hero_alt, 'published', 'zh-Hans'
FROM mythologies;

INSERT OR IGNORE INTO world_translations (
  world_id, locale, name, summary, hero_alt, translation_status, source_locale
)
SELECT id, 'zh-Hans', name, summary, hero_alt, 'published', 'zh-Hans'
FROM worlds;

INSERT OR IGNORE INTO scene_translations (
  scene_id, locale, name, summary, hero_alt, translation_status, source_locale
)
SELECT id, 'zh-Hans', name, summary, hero_alt, 'published', 'zh-Hans'
FROM scenes;

INSERT OR IGNORE INTO character_translations (
  character_id, locale, name, role, summary, portrait_alt, translation_status, source_locale
)
SELECT id, 'zh-Hans', name, role, summary, portrait_alt, 'published', 'zh-Hans'
FROM characters;

INSERT OR IGNORE INTO style_translations (
  style_id, locale, name, translation_status, source_locale
)
SELECT id, 'zh-Hans', name, 'published', 'zh-Hans'
FROM styles;

-- Legacy name_en is useful bootstrap data, but it is not enough to publish a
-- localized entity page. Seed English rows as draft only; prose remains NULL
-- until translated/reviewed.
INSERT OR IGNORE INTO mythology_translations (
  mythology_id, locale, name, translation_status, source_locale
)
SELECT id, 'en', name_en, 'draft', 'zh-Hans'
FROM mythologies
WHERE TRIM(name_en) <> '';

INSERT OR IGNORE INTO world_translations (
  world_id, locale, name, translation_status, source_locale
)
SELECT id, 'en', name_en, 'draft', 'zh-Hans'
FROM worlds
WHERE TRIM(name_en) <> '';

INSERT OR IGNORE INTO scene_translations (
  scene_id, locale, name, translation_status, source_locale
)
SELECT id, 'en', name_en, 'draft', 'zh-Hans'
FROM scenes
WHERE TRIM(name_en) <> '';

INSERT OR IGNORE INTO character_translations (
  character_id, locale, name, translation_status, source_locale
)
SELECT id, 'en', name_en, 'draft', 'zh-Hans'
FROM characters
WHERE TRIM(name_en) <> '';

INSERT OR IGNORE INTO style_translations (
  style_id, locale, name, translation_status, source_locale
)
SELECT id, 'en', name_en, 'draft', 'zh-Hans'
FROM styles
WHERE TRIM(name_en) <> '';
