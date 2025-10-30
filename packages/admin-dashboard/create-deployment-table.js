const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

console.log('🔄 Creating deployment_logs table via Supabase API...\n');

async function checkTable() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Try to query the table to see if it exists
  const { data, error } = await supabase
    .from('deployment_logs')
    .select('id')
    .limit(1);

  if (error) {
    if (error.code === '42P01') {
      console.log('❌ Table does not exist yet');
      console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
      console.log('   Dashboard → SQL Editor → New Query\n');
      console.log('--- COPY THE SQL FROM supabase/migrations/20251030200000_create_deployment_logs.sql ---\n');
      return false;
    } else {
      console.log('⚠️  Error checking table:', error.message);
      return false;
    }
  } else {
    console.log('✅ Table deployment_logs already exists!');
    console.log(`   Found ${data ? data.length : 0} records`);
    return true;
  }
}

checkTable();
