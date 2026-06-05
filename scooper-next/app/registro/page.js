'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Registro() {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [terminos, setTerminos] = useState(false)
    const [errores, setErrores] = useState({})
    const [registrado, setRegistrado] = useState(false)
    const [cargando, setCargando] = useState(false)
    const router = useRouter()

    function validarFormulario() {
        const nuevosErrores = {}

        if (nombre.trim().length < 2) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.'
        }

        const formatoEmail = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
        if (!formatoEmail.test(email)) {
            nuevosErrores.email = 'El email no tiene un formato válido.'
        }

        if (password.length < 8) {
            nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.'
        }

        if (confirmPassword !== password) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.'
        }

        if (!terminos) {
            nuevosErrores.terminos = 'Tenés que aceptar los términos para registrarte.'
        }

        return nuevosErrores
    }

    async function manejarSubmit(e) {
        e.preventDefault()

        const nuevosErrores = validarFormulario()
        setErrores(nuevosErrores)
        if (Object.keys(nuevosErrores).length > 0) return

        setCargando(true)

        try {
            // Supabase Auth: crea el usuario en auth.users
            // El nombre se guarda en user_metadata para poder mostrarlo después
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nombre }
                }
            })

            if (error) {
                setErrores({ general: error.message })
                return
            }

            // Hacer login automático con las mismas credenciales
            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

            if (loginError) {
                // Si falla (ej: confirmación de email requerida), mostrar mensaje
                setRegistrado(true)
            } else {
                router.push('/')
            }
        } catch (err) {
            setErrores({ general: 'Error de conexión. Intentá de nuevo.' })
        } finally {
            setCargando(false)
        }
    }

    if (registrado) {
        return (
            <main className="registro-container">
                <div className="registro-exito">
                    <h1>¡Bienvenido a SCOOPER, {nombre}!</h1>
                    <p>Tu cuenta fue creada con éxito.</p>
                    <Link href="/login" className="btn-volver">Iniciar sesión</Link>
                </div>
            </main>
        )
    }

    return (
        <main className="registro-container">
            <div className="registro-card">
                <h1 className="registro-titulo">Crear cuenta</h1>
                <p className="registro-subtitulo">Sumate a SCOOPER y disfrutá de los nuevos sabores.</p>

                {errores.general && <p className="form-error">{errores.general}</p>}
                <form className="registro-form" onSubmit={manejarSubmit} noValidate>

                    <div className="form-grupo">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            aria-invalid={!!errores.nombre}
                        />
                        {errores.nombre && <span className="form-error">{errores.nombre}</span>}
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tunombre@email.com"
                            aria-invalid={!!errores.email}
                        />
                        {errores.email && <span className="form-error">{errores.email}</span>}
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            aria-invalid={!!errores.password}
                        />
                        {errores.password && <span className="form-error">{errores.password}</span>}
                    </div>

                    <div className="form-grupo">
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repetí la contraseña"
                            aria-invalid={!!errores.confirmPassword}
                        />
                        {errores.confirmPassword && <span className="form-error">{errores.confirmPassword}</span>}
                    </div>

                    <div className="form-grupo form-grupo-checkbox">
                        <label htmlFor="terminos">
                            <input
                                type="checkbox"
                                id="terminos"
                                checked={terminos}
                                onChange={(e) => setTerminos(e.target.checked)}
                            />
                            <span>Acepto los términos y condiciones</span>
                        </label>
                        {errores.terminos && <span className="form-error">{errores.terminos}</span>}
                    </div>

                    <button type="submit" className="btn-registro" disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <p className="registro-pie">
                        ¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link>
                    </p>
                </form>
            </div>
        </main>
    )
}
