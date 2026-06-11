import { createClient } from '@supabase/supabase-js'

// Cliente admin con service role key: bypasea RLS.
// Solo importar desde API routes (server-side), nunca desde componentes del cliente.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)
