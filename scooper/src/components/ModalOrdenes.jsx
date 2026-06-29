import { useEffect } from 'react';

function ModalOrdenes({ abierto, ordenes, onClose }) {
    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        if (abierto) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [abierto, onClose]);

    if (!abierto) return null;

    return (
        <div className="modal" style={{ display: 'block' }} role="dialog" aria-modal="true" aria-label="Historial de órdenes">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Mis órdenes</h2>
                    <button className="cerrar" onClick={onClose} aria-label="Cerrar órdenes">&times;</button>
                </div>
                <div className="carrito-items">
                    {ordenes.length === 0 ? (
                        <p className="carrito-vacio">No realizaste ninguna compra todavía</p>
                    ) : (
                        [...ordenes].reverse().map((orden, idx) => (
                            <div key={idx} className="orden-item">
                                <div className="orden-header">
                                    <span className="orden-numero">Orden #{ordenes.length - idx}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span className={`orden-estado orden-estado-${(orden.estado || 'pendiente').replace(' ', '-')}`}>
                                            {orden.estado || 'pendiente'}
                                        </span>
                                        <span className="orden-fecha">{orden.fecha}</span>
                                    </div>
                                </div>
                                <ul className="orden-productos">
                                    {orden.items.map(item => (
                                        <li key={item.id} className="orden-producto-linea">
                                            <span>{item.nombre} × {item.cantidad}</span>
                                            <span>${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="orden-total">
                                    <span>Total</span>
                                    <strong>${orden.total.toLocaleString('es-AR')}</strong>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ModalOrdenes;
