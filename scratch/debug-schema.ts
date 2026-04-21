import { createSupabaseServerClient } from './src/infrastructure/database/supabase-server'

async function debugSchema() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'notes' })
  
  if (error) {
    // try fallback select
    const { data: cols, error: err } = await supabase.from('notes').select('*').limit(1)
    console.log('Sample Row:', cols)
    console.log('Error:', err)
  } else {
    console.log('Columns:', data)
  }
}

debugSchema()
