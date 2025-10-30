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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🔄 Running deployment_logs migration...\n');

    const migrationPath = path.join(__dirname, 'supabase/migrations/20251030200000_create_deployment_logs.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the entire SQL file at once using the REST API
    const { data, error } = await supabase.rpc('exec', { sql });

    if (error) {
      // If exec RPC doesn't exist, we need to execute via PostgreSQL connection
      // Let's try using the query method directly
      console.log('⚠️  RPC method not available, trying direct SQL execution...\n');

      // For Supabase, we need to use the REST API or execute via their dashboard
      console.log('📋 Please run this SQL manually in Supabase Dashboard:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Navigate to SQL Editor');
      console.log('   4. Click "New Query"');
      console.log('   5. Copy and paste the SQL from:');
      console.log(`      ${migrationPath}`);
      console.log('   6. Click "Run"\n');

      console.log('Or copy this SQL:\n');
      console.log('---START SQL---');
      console.log(sql);
      console.log('---END SQL---\n');

      return;
    }

    console.log('✅ Migration completed successfully!');

    // Verify table was created
    const { data: tableCheck, error: checkError } = await supabase
      .from('deployment_logs')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('⚠️  Table created but verification failed:', checkError.message);
    } else {
      console.log('✅ Table deployment_logs verified and ready to use!');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n📋 Please run the migration manually using Supabase Dashboard (see instructions above)');
  }
}

runMigration();
