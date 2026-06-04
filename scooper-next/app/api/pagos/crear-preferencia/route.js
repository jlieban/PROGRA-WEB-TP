import { supabase, createAuthClient } from '@/lib/supabase'
import { client, Preference } from '@/lib/mercadopago'
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

    if (orden.estado !== 'pendiente') {
        return NextResponse.json(
            { error: `La orden no está pendiente (estado actual: ${orden.estado})` },
            { status: 400 }
        )
    }

    if (!orden.orden_items || orden.orden_items.length === 0) {
        return NextResponse.json({ error: 'La orden no tiene items' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://scooper-prograwebtp.vercel.app'

    // 3. Crear preferencia con SDK de Mercado Pago
    try {
        const preference = new Preference(client)

        const response = await preference.create({
            body: {
                items: orden.orden_items.map(item => ({
                    id: String(item.producto_id),
                    title: item.productos.nombre,
                    quantity: item.cantidad,
                    unit_price: Number(item.precio_unitario),
                    currency_id: 'ARS'
                })),
                payer: {
                    email: user.email
                },
                back_urls: {
                    success: `${appUrl}/pago-completado`,
                    failure: `${appUrl}/pago-fallido`,
                    pending: `${appUrl}/pago-pendiente`
                },
                auto_return: 'approved',
                external_reference: String(orden_id),
                notification_url: `${appUrl}/api/webhooks/mercado-pago`
            }
        })

        return NextResponse.json({
            init_point: response.init_point,
            preference_id: response.id
        })

    } catch (err) {
        console.error('Error Mercado Pago:', err)
        return NextResponse.json(
            { error: 'Error al crear preferencia de pago' },
            { status: 500 }
        )
    }
}
