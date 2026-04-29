'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Registro() {
    // Un useState por cada campo del formulario.
    // El "valor" que se ve dentro del input siempre es lo que está acá.
    // Cuando el usuario escribe, llamamos al setter (ej. setNombre) y React
    // re-renderiza el input con el valor nuevo. Esto se llama "input controlado".
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [terminos, setTerminos] = useState(false)

    // Un objeto que guarda los mensajes de error de cada campo.
    // Si un campo no tiene error, su clave no aparece o está vacía.
    // Ejemplo: { email: 'El email no tiene formato válido', password: '...' }
    const [errores, setErrores] = useState({})

    // Estado para mostrar el mensaje de éxito una vez registrado.
    const [registrado, setRegistrado] = useState(false)

    // Función que valida todos los campos y devuelve un objeto con los errores.
    // Si el objeto está vacío, significa que todo está bien.
    function validarFormulario() {
        const nuevosErrores = {}

        // Validación 1 — Nombre: que no esté vacío y tenga al menos 2 letras.
        if (nombre.trim().length < 2) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.'
        }

        // Validación 2 — Email: formato válido.
        // El regex chequea que tenga algo + @ + algo + . + algo
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formatoEmail.test(email)) {
            nuevosErrores.email = 'El email no tiene un formato válido.'
        }

        // Validación 3 — Contraseña: al menos 8 caracteres.
        if (password.length < 8) {
            nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.'
        }

        // Validación 4 — Confirmar contraseña: tiene que coincidir con la primera.
        // Esta validación NO se puede hacer con HTML5 solo: necesita JS para
        // comparar dos campos entre sí.
        if (confirmPassword !== password) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.'
        }

        // Validación 5 — Términos: el checkbox tiene que estar marcado.
        if (!terminos) {
            nuevosErrores.terminos = 'Tenés que aceptar los términos para registrarte.'
        }

        return nuevosErrores
    }

    // Esta función corre cuando el usuario aprieta el botón "Crear cuenta".
    // El parámetro 'e' es el "evento" del submit que dispara el formulario.
    function manejarSubmit(e) {
        // event.preventDefault() evita el comportamiento por defecto del navegador,
        // que sería: recargar la página y enviar los datos a la URL del form.
        // Como nosotros queremos manejar todo con JS, lo bloqueamos.
        e.preventDefault()

        // Corremos las validaciones.
        const nuevosErrores = validarFormulario()
        setErrores(nuevosErrores)

        // Si el objeto de errores tiene alguna clave, hay errores: no seguimos.
        if (Object.keys(nuevosErrores).length > 0) {
            return
        }

        // Si llegamos acá, todos los campos son válidos.
        // En un proyecto real, ahora haríamos un fetch POST al backend.
        // Como no tenemos backend, simulamos el éxito mostrando el mensaje.
        setRegistrado(true)
    }

    // Si ya se registró con éxito, mostramos solo el mensaje.
    if (registrado) {
        return (
            <main className="registro-container">
                <div className="registro-exito">
                    <h1>¡Bienvenido a SCOOPER, {nombre}!</h1>
                    <p>Tu cuenta fue creada con éxito.</p>
                    <Link href="/" className="btn-volver">Volver al inicio</Link>
                </div>
            </main>
        )
    }

    return (
        <main className="registro-container">
            <div className="registro-card">
                <h1 className="registro-titulo">Crear cuenta</h1>
                <p className="registro-subtitulo">Sumate a SCOOPER y disfrutá de los nuevos sabores.</p>

                {/* noValidate desactiva la validación automática del navegador para
                    que solo se muestren NUESTROS mensajes de error personalizados. */}
                <form className="registro-form" onSubmit={manejarSubmit} noValidate>

                    {/* CAMPO 1 — Nombre */}
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

                    {/* CAMPO 2 — Email */}
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

                    {/* CAMPO 3 — Contraseña */}
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

                    {/* CAMPO 4 — Confirmar contraseña */}
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

                    {/* CAMPO 5 — Términos y condiciones (checkbox) */}
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

                    <button type="submit" className="btn-registro">Crear cuenta</button>

                    <p className="registro-pie">
                        ¿Ya tenés cuenta? <Link href="/">Volver al inicio</Link>
                    </p>
                </form>
            </div>
        </main>
    )
}
