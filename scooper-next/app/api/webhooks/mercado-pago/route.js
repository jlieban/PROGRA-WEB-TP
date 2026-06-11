import { NextResponse } from 'next/server'
import { client, Payment } from '@/lib/mercadopago'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Verificación del endpoint por Mercado Pago
export async function GET() {
    return NextResponse.json({ status: 'ok' })
}

// POST - Recibe notificaciones de Mercado Pago
// MP envía una notificación cuando el estado de un pago cambia.
// Siempre respondemos 200 para que MP no reintente el envío.
export async function POST(request) {
    try {
        const body = await request.json()

        // MP manda distintos tipos: "payment", "merchant_order", etc.
        // Solo nos interesa "payment"
        if (body.type !== 'payment') {
            return NextResponse.json({ received: true }, { status: 200 })
        }

        const paymentId = body.data?.id
        if (!paymentId) {
            return NextResponse.json({ received: true }, { status: 200 })
        }

        // Consultar el pago a la API de Mercado Pago
        const paymentClient = new Payment(client)
        const payment = await paymentClient.get({ id: paymentId })

        const ordenId = payment.external_reference  // el UUID de la orden en Supabase
        const estadoPago = payment.status           // 'approved', 'rejected', 'pending'

        if (!ordenId) {
            return NextResponse.json({ received: true }, { status: 200 })
        }

        // Actualizar la orden en Supabase según el estado del pago
        if (estadoPago === 'approved') {
            await supabaseAdmin
                .from('ordenes')
                .update({
                    estado: 'pagado',
                    metodo_pago: 'mercado_pago',
                    referencia_pago: String(paymentId),
                    pagado_en: new Date().toISOString(),
                })
                .eq('id', ordenId)
                .eq('estado', 'pendiente') // solo actualizar si sigue pendiente (idempotente)
        }

        // Si el pago fue rechazado o está pendiente, dejamos la orden como 'pendiente'
        // para que el usuario pueda reintentar el pago

        return NextResponse.json({ received: true }, { status: 200 })

    } catch (error) {
        console.error('Error procesando webhook MP:', error)
        // Respondemos 200 igual para que MP no reintente
        return NextResponse.json({ received: true }, { status: 200 })
    }
}
