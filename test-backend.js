const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers()
  const userId = users.users[0].id
  console.log("Testing insert with user:", userId)

  const { data, error } = await supabase
    .from('notes')
    .upsert({
      owner_id: userId,
      title: 'Test Note',
      content: ''
    })
    .select()

  console.log("Upsert result:", JSON.stringify({ data, error }, null, 2))
}

run()
