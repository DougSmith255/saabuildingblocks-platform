-- Update all typography viewport ranges to 250-3000
UPDATE master_controller_typography
SET settings = jsonb_set(
  jsonb_set(
    settings,
    ARRAY[text_type, 'size', 'viewportMin'],
    '250'::jsonb
  ),
  ARRAY[text_type, 'size', 'viewportMax'],
  '3000'::jsonb
)
WHERE 
  settings->text_type->'size'->>'viewportMin' = '300'
  AND settings->text_type->'size'->>'viewportMax' = '2050';

-- Update spacing viewport ranges
UPDATE master_controller_spacing
SET 
  container_padding = jsonb_set(
    jsonb_set(
      container_padding,
      '{viewportMin}',
      '250'::jsonb
    ),
    '{viewportMax}',
    '3000'::jsonb
  ),
  grid_gap = jsonb_set(
    jsonb_set(
      grid_gap,
      '{viewportMin}',
      '250'::jsonb
    ),
    '{viewportMax}',
    '3000'::jsonb
  ),
  section_margin = jsonb_set(
    jsonb_set(
      section_margin,
      '{viewportMin}',
      '250'::jsonb
    ),
    '{viewportMax}',
    '3000'::jsonb
  )
WHERE 
  container_padding->>'viewportMin' = '300'
  OR grid_gap->>'viewportMin' = '300'
  OR section_margin->>'viewportMin' = '300';
