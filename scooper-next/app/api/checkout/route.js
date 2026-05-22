import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    // 1. Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return NextResponse.json({ error: 'Debés iniciar sesión para confirmar la compra' }, { status: 401 })
    }

    // Cliente autenticado: las queries llevan el JWT → RLS funciona
    const db = createAuthClient(token)

    // 2. Leer carrito del usuario desde la BD
    const { data: carritoItems, error: carritoError } = await db
        .from('carrito')
        .select('id, cantidad, producto:productos(id, nombre, precio, stock)')
        .eq('usuario_id', user.id)

    if (carritoError) return NextResponse.json({ error: carritoError.message }, { status: 500 })

    if (!carritoItems || carritoItems.length === 0) {
        return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // 3. Validar stock
    for (const item of carritoItems) {
        if (item.producto.stock < item.cantidad) {
            return NextResponse.json(
                { error: `Stock insuficiente para ${item.producto.nombre}` },
                { status: 400 }
            )
        }
    }

    // 4. Calcular total en el servidor (nunca confiar en el cliente)
    const total = carritoItems.reduce(
        (sum, item) => sum + item.producto.precio * item.cantidad,
        0
    )

    // 5. Crear la orden
    const { data: orden, error: ordenError } = await db
        .from('ordenes')
        .insert({ usuario_id: user.id, total, estado: 'confirmado' })
        .select()
        .single()

    if (ordenError) return NextResponse.json({ error: ordenError.message }, { status: 500 })

    // 6. Guardar items de la orden
    const ordenItems = carritoItems.map(item => ({
        orden_id: orden.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio
    }))
    await db.from('orden_items').insert(ordenItems)

    // 7. Descontar stock
    for (const item of carritoItems) {
        await db
            .from('productos')
            .update({ stock: item.producto.stock - item.cantidad })
            .eq('id', item.producto.id)
    }

    // 8. Vaciar carrito
    await db.from('carrito').delete().eq('usuario_id', user.id)

    return NextResponse.json({ mensaje: '¡Compra confirmada!', orden })
}
