import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const { id } = await params

    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)
}
