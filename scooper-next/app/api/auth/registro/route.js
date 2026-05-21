import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    const { nombre, email, password } = await request.json()

    if (!nombre || !email || !password) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    // Verificar si el email ya existe
    const { data: existing } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single()

    if (existing) {
        return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }

    // Hashear la contraseña antes de guardarla
    // El número 10 es el "salt rounds": cuántas veces se aplica el algoritmo.
    // Más alto = más seguro pero más lento. 10 es el estándar recomendado.
    const passwordHash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
        .from('usuarios')
        .insert({ nombre, email, password: passwordHash })
        .select('id, nombre, email')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
}
