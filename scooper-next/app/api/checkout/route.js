import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    // Verificar autenticación con Supabase Auth
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return NextResponse.json({ error: 'Debés iniciar sesión para confirmar la compra' }, { status: 401 })
    }

    // Recibimos los items del carrito desde el cliente
    // Cada item tiene: { producto_id, cantidad }
    const { items } = await request.json()

    if (!items || items.length === 0) {
        return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // Obtenemos los precios desde la base de datos (no confiamos en el cliente)
    const productoIds = items.map(i => i.producto_id)
    const { data: productos, error: productosError } = await supabase
        .from('productos')
        .select('id, precio')
        .in('id', productoIds)

    if (productosError) {
        return NextResponse.json({ error: productosError.message }, { status: 500 })
    }

    // Calculamos el total usando precios del servidor
    const precioMap = Object.fromEntries(productos.map(p => [p.id, p.precio]))
    const total = items.reduce((acc, item) => {
        return acc + (precioMap[item.producto_id] || 0) * item.cantidad
    }, 0)

    // Crear la orden
    const { data: orden, error: ordenError } = await supabase
        .from('ordenes')
        .insert({ usuario_id: user.id, total, estado: 'confirmado' })
        .select()
        .single()

    if (ordenError) {
        return NextResponse.json({ error: ordenError.message }, { status: 500 })
    }

    // Guardar los items de la orden con el precio real del servidor
    const ordenItems = items.map(item => ({
        orden_id: orden.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: precioMap[item.producto_id]
    }))

    const { error: itemsError } = await supabase.from('orden_items').insert(ordenItems)

    if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ mensaje: '¡Compra confirmada!', orden })
}
