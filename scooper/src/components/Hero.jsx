function Hero() {
    function scrollAProductos() {
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section className="hero" id="inicio">
            <div className="hero-inner">
                <div className="hero-texto">
                    <p className="hero-kicker">— Colección 2026</p>
                    <h1 className="hero-titulo">Cada pote,<br /><em>una obra.</em></h1>
                    <p className="hero-bajada">Sabores únicos elaborados con ingredientes seleccionados. Sin artificios. Sin apuros.</p>
                    <button className="btn-ver" onClick={scrollAProductos}>Ver sabores</button>
                </div>
                <div className="hero-imagen-wrapper">
                    <img src="principal.png" alt="Helado artesanal SCOOPER" className="hero-imagen-principal" />
                </div>
            </div>
        </section>
    );
}

export default Hero;
