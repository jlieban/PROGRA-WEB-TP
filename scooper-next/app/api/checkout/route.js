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

    const db = createAuthClient(token)

    // 2. Leer los items del carrito enviados por el cliente
    const body = await request.json()
    const clientItems = body?.items

    if (!clientItems || clientItems.length === 0) {
        return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
    }

    // 3. Buscar los precios y stock actuales desde la BD (nunca confiar en precios del cliente)
    const productoIds = clientItems.map(i => i.producto_id)
    const { data: productos, error: prodError } = await db
        .from('productos')
        .select('id, nombre, precio, stock')
        .in('id', productoIds)

    if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 })

    // 4. Validar que todos los productos existen y tienen stock suficiente
    for (const item of clientItems) {
        const producto = productos.find(p => p.id === item.producto_id)
        if (!producto) {
            return NextResponse.json({ error: `Producto no encontrado` }, { status: 400 })
        }
        if (producto.stock < item.cantidad) {
            return NextResponse.json(
                { error: `Stock insuficiente para ${producto.nombre}` },
                { status: 400 }
            )
        }
    }

    // 5. Calcular total en el servidor con precios de la BD
    const total = clientItems.reduce((sum, item) => {
        const producto = productos.find(p => p.id === item.producto_id)
        return sum + producto.precio * item.cantidad
    }, 0)

    // 6. Preparar items para el stored procedure
    const items = clientItems.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio: productos.find(p => p.id === item.producto_id).precio
    }))

    // 7. Llamar al stored procedure (transacción atómica)
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
