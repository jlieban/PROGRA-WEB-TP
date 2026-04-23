function Header({ totalItems, onOpenCarrito }) {
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
                        <li><a href="#contacto" className="nav-link">Contacto</a></li>
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
    );
}

export default Header;
