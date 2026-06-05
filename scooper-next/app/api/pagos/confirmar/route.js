import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
    // 1. Verificar autenticación
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { payment_id, orden_id } = await request.json()

    if (!payment_id || !orden_id) {
        return NextResponse.json({ error: 'Faltan payment_id u orden_id' }, { status: 400 })
    }

    const db = createAuthClient(token)

    // 2. Verificar que la orden existe, pertenece al usuario y está pendiente
    const { data: orden, error: ordenError } = await db
        .from('ordenes')
        .select('id, estado, usuario_id')
        .eq('id', orden_id)
        .eq('usuario_id', user.id)
        .single()

    if (ordenError || !orden) {
        return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Si ya fue pagada, no hacer nada (idempotente)
    if (orden.estado === 'pagado') {
        return NextResponse.json({ ok: true })
    }

    // 3. Actualizar las columnas de pago
    const { error: updateError } = await db
        .from('ordenes')
        .update({
            estado: 'pagado',
            metodo_pago: 'mercado_pago',
            referencia_pago: String(payment_id),
            pagado_en: new Date().toISOString(),
        })
        .eq('id', orden_id)
        .eq('usuario_id', user.id)

    if (updateError) {
        console.error('Error actualizando orden:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
}
