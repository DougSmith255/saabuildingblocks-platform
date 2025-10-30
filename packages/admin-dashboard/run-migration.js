const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🔄 Running deployment_logs migration...');

    const migrationPath = path.join(__dirname, 'supabase/migrations/20251030200000_create_deployment_logs.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolons and filter out comments/empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });

        if (error) {
          console.error('❌ Error:', error.message);
          // Continue with next statement
        } else {
          console.log('✅ Success');
        }
      }
    }

    console.log('✅ Migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
