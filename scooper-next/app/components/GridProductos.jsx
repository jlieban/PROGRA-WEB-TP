import TarjetaProducto from './TarjetaProducto'

export default function GridProductos({ productos, carrito, onVerDetalle, onAgregar, onActualizarCantidad }) {
    return (
        <section className="productos" id="sabores">
            <div className="container">
                <div className="seccion-header">
                    <p className="seccion-kicker">— Nuestros Sabores</p>
                    <h2 className="seccion-titulo">La selección</h2>
                </div>
                <div className="grid-productos">
                    {productos.map(producto => {
                        const item = carrito.find(i => i.id === producto.id)
                        return (
                            <TarjetaProducto
                                key={producto.id}
                                producto={producto}
                                cantidadEnCarrito={item ? item.cantidad : 0}
                                onVerDetalle={onVerDetalle}
                                onAgregar={onAgregar}
                                onActualizarCantidad={onActualizarCantidad}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
