import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ rol: 'cliente' })

    const { data: { user } } = await supabaseAdmin.auth.getUser(token)
    if (!user) return NextResponse.json({ rol: 'cliente' })

    const { data: perfil } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single()

    return NextResponse.json({ rol: perfil?.rol ?? 'cliente' })
}
