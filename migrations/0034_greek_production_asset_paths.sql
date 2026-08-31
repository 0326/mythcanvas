-- Keep production database rows aligned with the reviewed Greek World hero
-- assets. The source files and structured importer remain the long-term
-- authority; this migration makes a fresh environment converge before import.
UPDATE mythologies
SET hero_src = '/media/content/greek-olympus-v2.webp',
    hero_alt = '晨光下的奥林匹斯白色大理石议庭、山巅与云海',
    hero_width = 1672,
    hero_height = 941,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'myth-greek';

UPDATE artworks
SET asset_key = '/media/content/greek-olympus-mobile-v1.webp',
    asset_mime = 'image/webp',
    width = 941,
    height = 1672,
    alt_text = '竖幅晨光中的奥林匹斯：金色光线穿过大理石柱廊',
    source_type = 'ai',
    license = 'MythCanvas AI-generated original',
    creator = 'MythCanvas',
    ai_model = 'gpt-image-2',
    prompt_meta_json = '{"provider":"OpenAI","model":"gpt-image-2","promptRecipeId":"greek-world-olympus-mobile-v1","promptLayers":{"mythology":"myth-greek","world":"world-olympus","style":"cinematic","scene":null,"outputSpec":"mobile-wallpaper","userRefinement":null,"guardrails":["preserve world identity","avoid copyrighted modern adaptations"]}}',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'art-olympus-dawn';
