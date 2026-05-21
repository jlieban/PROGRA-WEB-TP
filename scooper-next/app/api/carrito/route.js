import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET - Trae el carrito de un usuario
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
        return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('carrito')
        .select('*, productos(*)')
        .eq('user_id', user_id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

// POST - Agrega un producto al carrito
export async function POST(request) {
    const { user_id, producto_id, cantidad } = await request.json()

    if (!user_id || !producto_id) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    // Si el producto ya está en el carrito, actualiza la cantidad
    const { data: existing } = await supabase
        .from('carrito')
        .select('*')
        .eq('user_id', user_id)
        .eq('producto_id', producto_id)
        .single()

    if (existing) {
        const { data, error } = await supabase
            .from('carrito')
            .update({ cantidad: existing.cantidad + (cantidad || 1) })
            .eq('id', existing.id)
            .select()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data[0])
    }

    // Si no está, lo agrega
    const { data, error } = await supabase
        .from('carrito')
        .insert({ user_id, producto_id, cantidad: cantidad || 1 })
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data[0], { status: 201 })
}
