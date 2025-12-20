import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColorImageColumn() {
  console.log('Checking if profile_image_color_url column exists...');

  // Try to query the column - if it doesn't exist, we'll get an error
  const { data, error: queryError } = await supabase
    .from('agent_pages')
    .select('id, profile_image_color_url')
    .limit(1);

  if (queryError && queryError.message.includes('does not exist')) {
    console.log('Column does not exist. Please add it manually in Supabase dashboard:');
    console.log('');
    console.log('SQL to run:');
    console.log('ALTER TABLE agent_pages ADD COLUMN profile_image_color_url TEXT;');
    console.log('');
    console.log('Or run this in Supabase SQL Editor.');
  } else if (!queryError) {
    console.log('Column already exists! Data:', data);
  } else {
    console.error('Query error:', queryError);
  }
}

addColorImageColumn();
