function Footer() {
    return (
        <footer className="footer" id="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <p className="footer-marca">SCOOPER</p>
                    <p className="footer-tagline">Helados Artesanales</p>
                </div>
                <div className="footer-contacto">
                    <p className="footer-contacto-titulo">Contacto</p>
                    <ul className="footer-contacto-lista">
                        <li>
                            <span className="footer-label">Teléfono</span>
                            <a href="tel:+541145678901">+54 11 4567-8901</a>
                        </li>
                        <li>
                            <span className="footer-label">Email</span>
                            <a href="mailto:scooper@gmail.com">scooper@gmail.com</a>
                        </li>
                        <li>
                            <span className="footer-label">Instagram</span>
                            <a href="https://instagram.com/scooperhelados" target="_blank" rel="noopener">@scooperhelados</a>
                        </li>
                        <li>
                            <span className="footer-label">TikTok</span>
                            <a href="https://tiktok.com/@scooperhelados" target="_blank" rel="noopener">@scooperhelados</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container footer-copy-bar">
                <p className="footer-copy">© 2026 — SCOOPER. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;
