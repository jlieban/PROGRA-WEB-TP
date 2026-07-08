import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

async function verificarAdmin(token) {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: perfil } = await supabaseAdmin
        .from('usuarios')
        .select('rol')
        .eq('id', user.id)
        .single()

    if (perfil?.rol !== 'admin') return null
    return user
}

// GET - Todos los productos
export async function GET(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { data, error } = await supabaseAdmin
        .from('productos')
        .select('*')
        .order('id')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// POST - Crear nuevo producto
export async function POST(request) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const admin = await verificarAdmin(token)
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const body = await request.json()
    const { nombre, descripcion, precio, stock, imagen } = body

    if (!nombre || !precio) {
        return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 })
    }

    const precioNum = Number(precio)
    const stockNum = Number(stock ?? 0)

    if (Number.isNaN(precioNum) || precioNum < 0) {
        return NextResponse.json({ error: 'El precio no puede ser negativo' }, { status: 400 })
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
        return NextResponse.json({ error: 'El stock no puede ser negativo' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
        .from('productos')
        .insert({ nombre, descripcion, precio: precioNum, stock: stockNum, imagen })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}
