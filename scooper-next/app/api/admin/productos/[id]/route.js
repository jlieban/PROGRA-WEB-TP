import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

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

// PUT - Editar producto
export async function PUT(request, { params }) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { nombre, descripcion, precio, stock, imagen } = body

    const { error } = await supabaseAdmin
        .from('productos')
        .update({ nombre, descripcion, precio, stock, imagen })
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}

// DELETE - Eliminar producto
export async function DELETE(request, { params }) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id } = await params

    const { error } = await supabaseAdmin
        .from('productos')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}
