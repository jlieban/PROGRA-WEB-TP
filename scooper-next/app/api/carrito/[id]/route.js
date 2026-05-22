import { supabase, createAuthClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
    const { id } = await params

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const db = createAuthClient(token)
    const { error } = await db
        .from('carrito')
        .delete()
        .eq('id', id)
        .eq('usuario_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ mensaje: 'Producto eliminado del carrito' })
}
