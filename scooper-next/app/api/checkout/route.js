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

    // 5. Preparar items para el stored procedure
    const items = carritoItems.map(item => ({
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio: item.producto.precio
    }))

    // 6. Llamar al stored procedure (transacción atómica: crea orden + items + descuenta stock + vacía carrito)
    const { data, error: rpcError } = await db.rpc('crear_orden_completa', {
        p_usuario_id: user.id,
        p_items: items,
        p_total: total
    })

    if (rpcError || !data?.[0]?.success) {
        return NextResponse.json(
            { error: data?.[0]?.error_msg || rpcError?.message || 'Error al crear la orden' },
            { status: 500 }
        )
    }

    return NextResponse.json({ mensaje: '¡Compra confirmada!', orden_id: data[0].orden_id })
}
