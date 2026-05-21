import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET - Devuelve el historial de órdenes del usuario autenticado
export async function GET(request) {
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('ordenes')
        .select('*, orden_items(*, productos(nombre, imagen))')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
