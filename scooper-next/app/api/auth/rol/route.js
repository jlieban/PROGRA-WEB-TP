import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        return NextResponse.json({ rol: null, autenticado: false })
    }

    const { data: perfil } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single()

    return NextResponse.json({
        rol: perfil?.rol ?? 'cliente',
        autenticado: true,
        email: user.email
    })
}
