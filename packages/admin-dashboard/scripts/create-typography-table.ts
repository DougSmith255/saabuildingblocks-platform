import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createTable() {
  console.log('Creating email_typography_settings table...\n');

  // Create table
  const  sql = `
    CREATE TABLE IF NOT EXISTS email_typography_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      -- H1 Settings
      h1_font_family VARCHAR(100) DEFAULT 'Taskor',
      h1_font_weight INTEGER DEFAULT 400,
      h1_font_size VARCHAR(20) DEFAULT '32px',
      h1_color VARCHAR(20) DEFAULT '#ffd700',
      h1_line_height DECIMAL(3,2) DEFAULT 1.2,
      h1_letter_spacing VARCHAR(20) DEFAULT '0',
      h1_text_shadow TEXT DEFAULT '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',

      -- H2 Settings
      h2_font_family VARCHAR(100) DEFAULT 'Amulya',
      h2_font_weight INTEGER DEFAULT 700,
      h2_font_size VARCHAR(20) DEFAULT '24px',
      h2_color VARCHAR(20) DEFAULT '#e5e4dd',
      h2_line_height DECIMAL(3,2) DEFAULT 1.3,
      h2_letter_spacing VARCHAR(20) DEFAULT '0',

      -- H3 Settings
      h3_font_family VARCHAR(100) DEFAULT 'Amulya',
      h3_font_weight INTEGER DEFAULT 600,
      h3_font_size VARCHAR(20) DEFAULT '18px',
      h3_color VARCHAR(20) DEFAULT '#e5e4dd',
      h3_line_height DECIMAL(3,2) DEFAULT 1.4,
      h3_letter_spacing VARCHAR(20) DEFAULT '0',

      -- Body Settings
      body_font_family VARCHAR(100) DEFAULT 'Synonym',
      body_font_weight INTEGER DEFAULT 300,
      body_font_size VARCHAR(20) DEFAULT '14px',
      body_color VARCHAR(20) DEFAULT '#bfbdb0',
      body_line_height DECIMAL(3,2) DEFAULT 1.7,
      body_letter_spacing VARCHAR(20) DEFAULT '0',

      -- Link Settings
      link_color VARCHAR(20) DEFAULT '#00ff88',
      link_hover_color VARCHAR(20) DEFAULT '#ffd700',

      -- Metadata
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_email_typography_active ON email_typography_settings(is_active);
  `;

  try {
    const { error: createError } = await supabase.rpc('exec_sql', { query: sql });
    if (createError) {
      console.error('❌ Error creating table:', createError);
      process.exit(1);
    }
    console.log('✓ Table and index created');

    // Insert default settings
    const { data: insertData, error: insertError } = await supabase
      .from('email_typography_settings')
      .insert({ is_active: true })
      .select();

    if (insertError) {
      if (insertError.code === '23505') {
        console.log('✓ Default settings already exist');
      } else {
        console.error('❌ Error inserting defaults:', insertError);
      }
    } else {
      console.log('✓ Default settings inserted:', insertData);
    }

    console.log('\n✅ email_typography_settings table is ready!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

createTable();
