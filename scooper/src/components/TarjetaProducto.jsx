import { useState } from 'react';

function TarjetaProducto({ producto, cantidadEnCarrito, onVerDetalle, onAgregar, onActualizarCantidad }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="tarjeta-producto" onClick={() => onVerDetalle(producto)}>
            <div className="producto-imagen-wrapper">
                {imgError ? (
                    <div className="producto-imagen-placeholder">
                        {producto.nombre.charAt(0)}
                    </div>
                ) : (
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="producto-imagen"
                        onError={() => setImgError(true)}
                    />
                )}
                <div className="producto-descripcion-overlay">
                    <p>{producto.descripcion}</p>
                </div>
            </div>
            <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-precio">${producto.precio.toLocaleString('es-AR')}</p>
                <div className="tarjeta-botones">
                    {cantidadEnCarrito > 0 ? (
                        <div className="tarjeta-cantidad" onClick={e => e.stopPropagation()}>
                            <button
                                className="btn-cantidad"
                                onClick={() => onActualizarCantidad(producto.id, cantidadEnCarrito - 1)}
                            >−</button>
                            <span>{cantidadEnCarrito}</span>
                            <button
                                className="btn-cantidad"
                                onClick={() => onActualizarCantidad(producto.id, cantidadEnCarrito + 1)}
                            >+</button>
                        </div>
                    ) : (
                        <button
                            className="btn-agregar"
                            onClick={(e) => { e.stopPropagation(); onAgregar(producto.id); }}
                        >
                            Agregar al carrito
                        </button>
                    )}
                    <button
                        className="btn-detalle"
                        onClick={(e) => { e.stopPropagation(); onVerDetalle(producto); }}
                    >
                        Ver detalle
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TarjetaProducto;
