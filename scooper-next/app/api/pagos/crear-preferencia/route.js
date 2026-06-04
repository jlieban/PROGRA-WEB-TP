import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    // 1. Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { orden_id } = await request.json()

    if (!orden_id) {
        return NextResponse.json({ error: 'Falta orden_id' }, { status: 400 })
    }

    const db = createAuthClient(token)

    // 2. Verificar que la orden existe y pertenece al usuario
    const { data: orden, error: ordenError } = await db
        .from('ordenes')
        .select('*, orden_items(*, productos(nombre, precio))')
        .eq('id', orden_id)
        .eq('usuario_id', user.id)
        .single()

    if (ordenError || !orden) {
        return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // 3. Verificar que está pendiente de pago
    if (orden.estado !== 'pendiente') {
        return NextResponse.json(
            { error: `La orden no está pendiente (estado actual: ${orden.estado})` },
            { status: 400 }
        )
    }

    // 4. Verificar que tiene items
    if (!orden.orden_items || orden.orden_items.length === 0) {
        return NextResponse.json({ error: 'La orden no tiene items' }, { status: 400 })
    }

    // 5. Construir estructura de preferencia para Mercado Pago (semana 13)
    const preferencia = {
        items: orden.orden_items.map(item => ({
            title: item.productos.nombre,
            quantity: item.cantidad,
            unit_price: Number(item.precio_unitario),
            currency_id: 'ARS'
        })),
        payer: {
            email: user.email
        },
        external_reference: String(orden_id),
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/pagos/webhook`
    }

    return NextResponse.json({
        preferencia,
        mensaje: 'Estructura lista para Mercado Pago'
    })
}
