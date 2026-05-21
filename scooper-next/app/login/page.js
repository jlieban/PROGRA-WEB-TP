'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function Login() {
    const router = useRouter()
    const { login } = useUser()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errores, setErrores] = useState({})
    const [cargando, setCargando] = useState(false)

    function validarFormulario() {
        const nuevosErrores = {}

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formatoEmail.test(email)) {
            nuevosErrores.email = 'El email no tiene un formato válido.'
        }

        if (password.length < 1) {
            nuevosErrores.password = 'Ingresá tu contraseña.'
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
            const respuesta = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const datos = await respuesta.json()

            if (!respuesta.ok) {
                setErrores({ general: datos.error || 'Error al iniciar sesión' })
                return
            }

            // Guardamos el usuario en el context (que también lo persiste en localStorage)
            login(datos)

            // Redirigimos al inicio con recarga completa para que el header lea el usuario
            window.location.href = '/'
        } catch (err) {
            setErrores({ general: 'Error de conexión. Intentá de nuevo.' })
        } finally {
            setCargando(false)
        }
    }

    return (
        <main className="registro-container">
            <div className="registro-card">
                <h1 className="registro-titulo">Iniciar sesión</h1>
                <p className="registro-subtitulo">Bienvenido de vuelta a SCOOPER.</p>

                {errores.general && <p className="form-error">{errores.general}</p>}

                <form className="registro-form" onSubmit={manejarSubmit} noValidate>

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
                            placeholder="Tu contraseña"
                            aria-invalid={!!errores.password}
                        />
                        {errores.password && <span className="form-error">{errores.password}</span>}
                    </div>

                    <button type="submit" className="btn-registro" disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>

                    <p className="registro-pie">
                        ¿No tenés cuenta? <Link href="/registro">Registrate</Link>
                    </p>

                </form>
            </div>
        </main>
    )
}
