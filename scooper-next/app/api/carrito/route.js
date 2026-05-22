import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

async function getUsuarioYCliente(request) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) return { user: null, db: null }

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return { user: null, db: null }

    // createAuthClient pasa el JWT en cada query → RLS puede leer auth.uid()
    return { user, db: createAuthClient(token) }
}

// GET - Trae el carrito del usuario autenticado
export async function GET(request) {
    const { user, db } = await getUsuarioYCliente(request)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { data, error } = await db
        .from('carrito')
        .select('*, productos(*)')
        .eq('usuario_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// POST - Agrega o actualiza un producto en el carrito
export async function POST(request) {
    const { user, db } = await getUsuarioYCliente(request)
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { producto_id, cantidad } = await request.json()
    if (!producto_id) return NextResponse.json({ error: 'Falta producto_id' }, { status: 400 })

    // Si ya existe, actualizar cantidad
    const { data: existing } = await db
        .from('carrito')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('producto_id', producto_id)
        .single()

    if (existing) {
        const { data, error } = await db
            .from('carrito')
            .update({ cantidad: existing.cantidad + (cantidad || 1) })
            .eq('id', existing.id)
            .select()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data[0])
    }

    const { data, error } = await db
        .from('carrito')
        .insert({ usuario_id: user.id, producto_id, cantidad: cantidad || 1 })
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data[0], { status: 201 })
}
