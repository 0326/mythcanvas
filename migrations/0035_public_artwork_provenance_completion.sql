-- Complete the provenance fields required by public artwork metadata.
-- The legacy files remain unchanged; this records their reviewed ownership in
-- D1 and removes the last NULL creator fields from published artwork rows.
UPDATE artworks
SET creator = 'MythCanvas',
    updated_at = CURRENT_TIMESTAMP
WHERE publish_status = 'published'
  AND (creator IS NULL OR creator = '')
  AND source_type IN ('original', 'ai');

-- These imported AI assets predate the structured importer. Preserve their
-- sourceFile/outputSpecId/sequence fields while adding provider/model recipe
-- fields used by the current generation audit.
UPDATE artworks
SET ai_model = COALESCE(ai_model, 'gpt-image-2'),
    prompt_meta_json = json_patch(
      COALESCE(prompt_meta_json, '{}'),
      '{"provider":"OpenAI","model":"gpt-image-2","promptRecipeId":"mythcanvas.character.legacy.v1"}'
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE publish_status = 'published'
  AND source_type = 'ai'
  AND id LIKE 'art-anubis-%';
