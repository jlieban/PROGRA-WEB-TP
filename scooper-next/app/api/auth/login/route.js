import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    const { email, password } = await request.json()

    if (!email || !password) {
        return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    // Buscamos el usuario por email (necesitamos el password hasheado para comparar)
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, password')
        .eq('email', email)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Comparamos la contraseña ingresada con el hash guardado
    const passwordValida = await bcrypt.compare(password, data.password)

    if (!passwordValida) {
        return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 })
    }

    // Devolvemos el usuario sin el password
    const { password: _, ...usuario } = data
    return NextResponse.json(usuario)
}
