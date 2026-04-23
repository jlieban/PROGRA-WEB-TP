export default function Hero() {
    function scrollAProductos() {
        document.getElementById('sabores').scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="hero" id="inicio">
            <img src="principal.png" alt="Helado artesanal SCOOPER" className="hero-bg" />
            <div className="hero-overlay" />
            <div className="hero-contenido">
                <p className="hero-kicker">— Colección 2026</p>
                <h1 className="hero-titulo">Cada pote,<br /><em>una obra.</em></h1>
                <p className="hero-bajada">Sabores únicos elaborados con ingredientes seleccionados. Sin artificios. Sin apuros.</p>
                <button className="btn-ver" onClick={scrollAProductos}>Ver sabores</button>
            </div>
        </section>
    )
}
