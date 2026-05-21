import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// DELETE - Elimina un item del carrito
export async function DELETE(request, { params }) {
    const { id } = await params

    const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ mensaje: 'Producto eliminado del carrito' })
}
