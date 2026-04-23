'use client'

import { useState, useEffect } from 'react'

export default function ModalProducto({ producto, onClose, onAgregar }) {
    const [cantidad, setCantidad] = useState(1)
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])

    useEffect(() => { setCantidad(1); setImgError(false) }, [producto])

    if (!producto) return null

    function confirmar() {
        onAgregar(producto.id, cantidad)
        onClose()
    }

    return (
        <div className="modal" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-producto-content">
                <button className="cerrar modal-producto-cerrar" onClick={onClose} aria-label="Cerrar">&times;</button>
                <div className="modal-producto-imagen-wrapper">
                    {imgError ? (
                        <div className="producto-imagen-placeholder">{producto.nombre.charAt(0)}</div>
                    ) : (
                        <img src={producto.imagen} alt={producto.nombre} className="modal-producto-imagen" onError={() => setImgError(true)} />
                    )}
                </div>
                <div className="modal-producto-info">
                    <h2 className="modal-producto-nombre">{producto.nombre}</h2>
                    <p className="modal-producto-descripcion">{producto.descripcion}</p>
                    <p className="modal-producto-precio">${producto.precio.toLocaleString('es-AR')}</p>
                    <div className="modal-producto-cantidad">
                        <span className="modal-cantidad-label">Cantidad</span>
                        <div className="cantidad-controles">
                            <button className="btn-cantidad" onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
                            <span>{cantidad}</span>
                            <button className="btn-cantidad" onClick={() => setCantidad(c => c + 1)}>+</button>
                        </div>
                    </div>
                    <button className="btn-comprar" onClick={confirmar}>Agregar al carrito</button>
                </div>
            </div>
        </div>
    )
}
