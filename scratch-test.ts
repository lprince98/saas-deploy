import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !users.users[0]) {
     console.error('No users found to test with.', userError);
     return;
  }
  const userId = users.users[0].id;
  
  // Try normal insert
  const { data, error } = await supabase
    .from('notes')
    .insert({
      owner_id: userId,
      title: '제목 없는 노트',
      content: ''
    });

  console.log('Result:', { data, error });
}

run().catch(console.error);
