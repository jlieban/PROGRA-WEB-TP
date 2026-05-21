'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '../context/UserContext'

export default function Ordenes() {
    const { usuario } = useUser()
    const router = useRouter()
    const [ordenes, setOrdenes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Si no hay usuario, redirigir al login
        if (usuario === null && !cargando) {
            router.push('/login')
            return
        }

        if (!usuario) return

        async function cargarOrdenes() {
            try {
                // Obtenemos el token de la sesión activa para enviarlo al API
                const { data: { session } } = await supabase.auth.getSession()

                const respuesta = await fetch('/api/ordenes', {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                })

                if (!respuesta.ok) {
                    setError('No se pudieron cargar las órdenes.')
                    return
                }

                const datos = await respuesta.json()
                setOrdenes(datos)
            } catch (err) {
                setError('Error de conexión.')
            } finally {
                setCargando(false)
            }
        }

        cargarOrdenes()
    }, [usuario])

    if (cargando) {
        return (
            <main className="ordenes-container">
                <p className="ordenes-cargando">Cargando tus órdenes...</p>
            </main>
        )
    }

    if (error) {
        return (
            <main className="ordenes-container">
                <p className="form-error">{error}</p>
            </main>
        )
    }

    return (
        <main className="ordenes-container">
            <div className="ordenes-header">
                <h1 className="ordenes-titulo">Mis pedidos</h1>
                <Link href="/" className="btn-volver">← Volver al inicio</Link>
            </div>

            {ordenes.length === 0 ? (
                <div className="ordenes-vacio">
                    <p>Todavía no hiciste ningún pedido.</p>
                    <Link href="/#sabores" className="btn-volver">Ver sabores</Link>
                </div>
            ) : (
                <div className="ordenes-lista">
                    {ordenes.map(orden => (
                        <div key={orden.id} className="orden-card">
                            <div className="orden-info">
                                <span className="orden-fecha">
                                    {new Date(orden.created_at).toLocaleDateString('es-AR', {
                                        day: '2-digit', month: 'long', year: 'numeric'
                                    })}
                                </span>
                                <span className={`orden-estado orden-estado-${orden.estado}`}>
                                    {orden.estado}
                                </span>
                            </div>

                            <ul className="orden-items">
                                {orden.orden_items?.map(item => (
                                    <li key={item.id} className="orden-item">
                                        <span className="orden-item-nombre">{item.productos?.nombre}</span>
                                        <span className="orden-item-cantidad">x{item.cantidad}</span>
                                        <span className="orden-item-precio">
                                            ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="orden-total">
                                Total: <strong>${orden.total.toLocaleString('es-AR')}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
