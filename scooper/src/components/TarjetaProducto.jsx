import { useState } from 'react';

function TarjetaProducto({ producto, onAgregar }) {
    const [seleccionado, setSeleccionado] = useState(false);
    const [imgError, setImgError] = useState(false);

    function toggleSeleccion() {
        setSeleccionado(prev => !prev);
    }

    return (
        <div
            className={`tarjeta-producto${seleccionado ? ' seleccionado' : ''}`}
            onClick={toggleSeleccion}
        >
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
                <button
                    className="btn-agregar"
                    onClick={(e) => { e.stopPropagation(); onAgregar(producto.id); }}
                >
                    Agregar al carrito
                </button>
            </div>
        </div>
    );
}

export default TarjetaProducto;
