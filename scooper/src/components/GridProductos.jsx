import TarjetaProducto from './TarjetaProducto';

function GridProductos({ productos, onAgregar }) {
    return (
        <section className="productos" id="productos">
            <div className="container">
                <div className="seccion-header">
                    <p className="seccion-kicker">— Nuestros Sabores</p>
                    <h2 className="seccion-titulo">La selección</h2>
                </div>
                <div className="grid-productos">
                    {productos.map(producto => (
                        <TarjetaProducto
                            key={producto.id}
                            producto={producto}
                            onAgregar={onAgregar}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default GridProductos;
