import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // This uses the Supabase SDK which has .execute() for raw SQL
    const { error } = await (supabase as any).from('_').select('*').limit(0);

    // Actually, we'll just insert a row and let the table be created via migrations
    // Or we can create the table schema directly in Supabase dashboard

    return NextResponse.json({
      message: 'Please create the table via Supabase SQL Editor',
      sql: `
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

INSERT INTO email_typography_settings (is_active) VALUES (true) ON CONFLICT DO NOTHING;
      `,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed' },
      { status: 500 }
    );
  }
}
