import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// Verifica que el usuario autenticado tenga rol admin
async function verificarAdmin(token) {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: perfil } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single()

    if (perfil?.rol !== 'admin') return null
    return user
}

// GET - Todas las órdenes de todos los usuarios
export async function GET(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { data, error } = await supabaseAdmin
        .from('ordenes')
        .select('*, orden_items(*, productos(nombre))')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// PATCH - Actualizar estado de una orden
export async function PATCH(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id, estado } = await request.json()
    const estadosValidos = ['pendiente', 'pagado', 'enviado', 'cancelado']
    if (!estadosValidos.includes(estado)) {
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
        .from('ordenes')
        .update({ estado })
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}
