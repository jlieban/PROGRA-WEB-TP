'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'

export default function Header({ totalItems, onOpenCarrito }) {
    const { usuario, logout } = useUser()
    const [dropdownAbierto, setDropdownAbierto] = useState(false)
    const dropdownRef = useRef(null)
    const pathname = usePathname()
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

    function cerrarSesion() {
        // Borra los tokens de Supabase directamente de localStorage (sin esperar red)
        Object.keys(localStorage)
            .filter(k => k.startsWith('sb-'))
            .forEach(k => localStorage.removeItem(k))
        window.location.href = '/'
    }

    // Si ya estamos en la home: scroll suave sin cambiar la URL.
    // Si estamos en otra página: navegación completa para que el navegador
    // maneje el scroll al hash de forma nativa (router.push no siempre scrollea).
    function irASeccion(e, seccionId) {
        e.preventDefault()
        if (pathname === '/') {
            document.getElementById(seccionId)?.scrollIntoView({ behavior: 'smooth' })
        } else {
            window.location.href = `/#${seccionId}`
        }
    }

    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo">
                    <Link href="/" className="logo-texto">SCOOPER</Link>
                </div>
                <nav>
                    <ul className="nav-menu">
                        <li><a href="/#inicio" className="nav-link" onClick={e => irASeccion(e, 'inicio')}>Inicio</a></li>
                        <li><a href="/#sabores" className="nav-link" onClick={e => irASeccion(e, 'sabores')}>Sabores</a></li>
                        {usuario && <li><Link href="/ordenes" className="nav-link">Órdenes</Link></li>}

                        <li><a href="/#contacto" className="nav-link" onClick={e => irASeccion(e, 'contacto')}>Contacto</a></li>
                        <li className="nav-usuario">
                            {usuario ? (
                                // Usuario logueado: solo botón cerrar sesión
                                <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
                                    Cerrar sesión
                                </button>
                            ) : (
                                // Sin sesión: dropdown con login y registro
                                <div ref={dropdownRef}>
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
                                </div>
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
