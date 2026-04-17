import { useEffect } from 'react';

function ModalCarrito({ abierto, carrito, onClose, onEliminar, onActualizarCantidad, onComprar }) {
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (abierto) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [abierto, onClose]);

    if (!abierto) return null;

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return (
        <div className="modal" style={{ display: 'block' }} role="dialog" aria-modal="true" aria-label="Carrito de compras">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Tu carrito</h2>
                    <button className="cerrar" onClick={onClose} aria-label="Cerrar carrito">&times;</button>
                </div>
                <div className="carrito-items">
                    {carrito.length === 0 ? (
                        <p className="carrito-vacio">El carrito está vacío</p>
                    ) : (
                        carrito.map(item => (
                            <div key={item.id} className="carrito-item">
                                <div className="carrito-item-info">
                                    <h3>{item.nombre}</h3>
                                    <div className="cantidad-controles">
                                        <button
                                            className="btn-cantidad"
                                            onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                                        >−</button>
                                        <span>{item.cantidad}</span>
                                        <button
                                            className="btn-cantidad"
                                            onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                                        >+</button>
                                    </div>
                                    <button className="btn-eliminar" onClick={() => onEliminar(item.id)}>
                                        Eliminar
                                    </button>
                                </div>
                                <p className="carrito-item-precio">
                                    ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                </p>
                            </div>
                        ))
                    )}
                </div>
                <div className="carrito-total">
                    <span>Total</span>
                    <strong>${total.toLocaleString('es-AR')}</strong>
                </div>
                <button className="btn-comprar" onClick={onComprar}>Finalizar compra</button>
            </div>
        </div>
    );
}

export default ModalCarrito;
