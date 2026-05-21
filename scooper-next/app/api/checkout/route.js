import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const { user_id } = await request.json()

    if (!user_id) {
        return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
    }

    // Traer los items del carrito
    const { data: carrito, error: carritoError } = await supabase
        .from('carrito')
        .select('*, productos(*)')
        .eq('user_id', user_id)

    if (carritoError || !carrito.length) {
        return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // Calcular total
    const total = carrito.reduce((acc, item) => {
        return acc + item.productos.precio * item.cantidad
    }, 0)

    // Crear la orden
    const { data: orden, error: ordenError } = await supabase
        .from('ordenes')
        .insert({ user_id, total, estado: 'confirmado' })
        .select()

    if (ordenError) {
        return NextResponse.json({ error: ordenError.message }, { status: 500 })
    }

    // Guardar los items de la orden
    const items = carrito.map(item => ({
        orden_id: orden[0].id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: item.productos.precio
    }))

    await supabase.from('orden_items').insert(items)

    // Vaciar el carrito
    await supabase.from('carrito').delete().eq('user_id', user_id)

    return NextResponse.json({ mensaje: '¡Compra confirmada!', orden: orden[0] })
}
