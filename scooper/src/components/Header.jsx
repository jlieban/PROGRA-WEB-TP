function Header({ totalItems, onOpenCarrito, onOpenOrdenes, sesion, onOpenAuth, onLogout }) {
    return (
        <header className="header">
            <div className="container header-inner">

                <div className="logo">
                    <span className="logo-texto">SCOOPER</span>
                </div>

                <nav>
                    <ul className="nav-menu">
                        <li><a href="#inicio" className="nav-link">Inicio</a></li>
                        <li><a href="#sabores" className="nav-link">Sabores</a></li>
                        {sesion?.tipo === 'usuario' && (
                            <li>
                                <button className="nav-link nav-link-btn" onClick={onOpenOrdenes}>
                                    Órdenes
                                </button>
                            </li>
                        )}
                        <li><a href="#contacto" className="nav-link">Contacto</a></li>
                    </ul>
                </nav>

                <div className="header-right">
                    {/* Sin sesión → ícono de persona */}
                    {!sesion && (
                        <button
                            className="nav-link nav-link-btn nav-link-admin"
                            onClick={() => onOpenAuth('login')}
                            title="Ingresar / Crear cuenta"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                            </svg>
                        </button>
                    )}

                    {/* Usuario registrado → avatar + nombre + Salir */}
                    {sesion?.tipo === 'usuario' && (
                        <div className="user-profile-header">
                            <div className="user-avatar-header">
                                {sesion.usuario.charAt(0).toUpperCase()}
                            </div>
                            <span className="user-name-header">{sesion.usuario}</span>
                            <button className="btn-user-logout" onClick={onLogout}>Salir</button>
                        </div>
                    )}


                    <button className="carrito-btn" onClick={onOpenCarrito} aria-label="Abrir carrito">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <span>{totalItems}</span>
                    </button>
                </div>

            </div>
        </header>
    );
}

export default Header;
