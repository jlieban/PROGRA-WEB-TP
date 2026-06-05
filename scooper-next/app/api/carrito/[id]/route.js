import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// PATCH - Actualiza la cantidad de un item del carrito
export async function PATCH(request, { params }) {
    const { id } = await params

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { cantidad } = await request.json()
    if (!cantidad || cantidad < 1) return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })

    const db = createAuthClient(token)
    const { error } = await db
        .from('carrito')
        .update({ cantidad })
        .eq('id', id)
        .eq('usuario_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}

export async function DELETE(request, { params }) {
    const { id } = await params

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const db = createAuthClient(token)
    const { error } = await db
        .from('carrito')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ mensaje: 'Producto eliminado del carrito' })
}
