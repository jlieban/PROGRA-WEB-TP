import { NextResponse } from 'next/server'

// GET - Verificación del webhook por Mercado Pago
export async function GET() {
    return NextResponse.json({ status: 'ok' })
}

// POST - Recibe notificaciones de Mercado Pago
// Implementación completa en Semana 14
export async function POST(request) {
    try {
        const body = await request.json()
        console.log('Webhook Mercado Pago recibido:', body)

        // Semana 14: acá se verificará la firma y se actualizará la orden
        // Por ahora solo confirmamos la recepción
        return NextResponse.json({ received: true }, { status: 200 })
    } catch {
        return NextResponse.json({ received: true }, { status: 200 })
    }
}
