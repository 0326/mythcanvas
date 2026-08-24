-- Publish the approved Light/Dark homepage Hero assets in the existing media route.
-- The Worker serves these keys through /media/{key}; Cloudflare Image Transformations
-- derives homepage thumbnails from the original 2560x1440 Hero objects.

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/chinese/home/light.webp',
  home_hero_dark_src = '/media/mythologies/chinese/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'chinese';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/greek/home/light.webp',
  home_hero_dark_src = '/media/mythologies/greek/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'greek';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/norse/home/light.webp',
  home_hero_dark_src = '/media/mythologies/norse/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'norse';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/egyptian/home/light.webp',
  home_hero_dark_src = '/media/mythologies/egyptian/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'egyptian';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/indian/home/light.webp',
  home_hero_dark_src = '/media/mythologies/indian/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'indian';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/japanese/home/light.webp',
  home_hero_dark_src = '/media/mythologies/japanese/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'japanese';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/celtic/home/light.webp',
  home_hero_dark_src = '/media/mythologies/celtic/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'celtic';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/maya/home/light.webp',
  home_hero_dark_src = '/media/mythologies/maya/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'maya';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/aztec/home/light.webp',
  home_hero_dark_src = '/media/mythologies/aztec/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'aztec';

UPDATE mythologies
SET
  home_hero_light_src = '/media/mythologies/mesopotamian/home/light.webp',
  home_hero_dark_src = '/media/mythologies/mesopotamian/home/dark.webp',
  home_hero_focal_x = 0.5,
  home_hero_focal_y = 0.42,
  updated_at = CURRENT_TIMESTAMP
WHERE slug = 'mesopotamian';
