'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function Header({ totalItems, onOpenCarrito }) {
    const { usuario, logout } = useUser()
    const [dropdownAbierto, setDropdownAbierto] = useState(false)
    const dropdownRef = useRef(null)
    const router = useRouter()

    // Cierra el dropdown si el usuario hace clic afuera
    useEffect(() => {
        function handleClickAfuera(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAbierto(false)
            }
        }
        document.addEventListener('mousedown', handleClickAfuera)
        return () => document.removeEventListener('mousedown', handleClickAfuera)
    }, [])

    async function cerrarSesion() {
        await logout()
        setDropdownAbierto(false)
        router.push('/')
    }

    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo">
                    <Link href="/" className="logo-texto">SCOOPER</Link>
                </div>
                <nav>
                    <ul className="nav-menu">
                        <li><Link href="/#inicio" className="nav-link">Inicio</Link></li>
                        <li><Link href="/#sabores" className="nav-link">Sabores</Link></li>
                        {usuario && <li><Link href="/ordenes" className="nav-link">Órdenes</Link></li>}
                        <li><Link href="/#contacto" className="nav-link">Contacto</Link></li>
                        <li className="nav-usuario" ref={dropdownRef}>
                            {usuario ? (
                                // Usuario logueado: muestra su nombre con dropdown
                                <>
                                    <button
                                        className="btn-usuario"
                                        onClick={() => setDropdownAbierto(!dropdownAbierto)}
                                    >
                                        {usuario.nombre}
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </button>
                                    {dropdownAbierto && (
                                        <div className="usuario-dropdown">
                                            <Link href="/ordenes" className="dropdown-item" onClick={() => setDropdownAbierto(false)}>
                                                Mis pedidos
                                            </Link>
                                            <div className="dropdown-divider"/>
                                            <button className="dropdown-item dropdown-cerrar" onClick={cerrarSesion}>
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Sin sesión: botón de login con opción de registro abajo
                                <>
                                    <button
                                        className="btn-usuario"
                                        onClick={() => setDropdownAbierto(!dropdownAbierto)}
                                    >
                                        Iniciar sesión
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </button>
                                    {dropdownAbierto && (
                                        <div className="usuario-dropdown">
                                            <Link href="/login" className="dropdown-item" onClick={() => setDropdownAbierto(false)}>
                                                Iniciar sesión
                                            </Link>
                                            <div className="dropdown-divider"/>
                                            <Link href="/registro" className="dropdown-item" onClick={() => setDropdownAbierto(false)}>
                                                Crear cuenta
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    </ul>
                </nav>
                <button className="carrito-btn" onClick={onOpenCarrito} aria-label="Abrir carrito">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span>{totalItems}</span>
                </button>
            </div>
        </header>
    )
}
