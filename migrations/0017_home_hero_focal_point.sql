-- Shared Light/Dark focal point for homepage hero and derived mythology card crops.
-- Light and Dark artwork intentionally share composition, so one focal point controls both themes.

ALTER TABLE mythologies ADD COLUMN home_hero_focal_x REAL NOT NULL DEFAULT 0.5;
ALTER TABLE mythologies ADD COLUMN home_hero_focal_y REAL NOT NULL DEFAULT 0.5;
