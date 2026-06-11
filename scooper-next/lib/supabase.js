import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Cliente general (para auth y operaciones públicas)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Cliente autenticado para API routes:
// Necesario para que las políticas de RLS reconozcan al usuario.
// Sin pasar el JWT, auth.uid() devuelve null y RLS bloquea las operaciones.
export function createAuthClient(token) {
    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: { Authorization: `Bearer ${token}` }
        }
    })
}

// Cliente admin con service role key: bypasea RLS.
// Usar solo en rutas de servidor donde no hay JWT de usuario (ej: webhooks).
export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)
