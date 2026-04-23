'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCarrito } from '../../context/CartContext'
import productos from '../../datos/productos'

export default function ProductoPage() {
    const { id } = useParams()
    const producto = productos.find(p => p.id === Number(id))
    const { agregarAlCarrito } = useCarrito()
    const [cantidad, setCantidad] = useState(1)
    const [imgError, setImgError] = useState(false)

    if (!producto) {
        return (
            <main className="container" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <p>Producto no encontrado.</p>
                <Link href="/" className="nav-link">← Volver</Link>
            </main>
        )
    }

    function confirmar() {
        agregarAlCarrito(producto.id, cantidad)
    }

    return (
        <main className="detalle-page">
            <div className="detalle-contenedor">
                <Link href="/#sabores" className="detalle-volver nav-link">← Volver a sabores</Link>
                <div className="detalle-grid">
                    <div className="detalle-imagen-wrapper">
                        {imgError ? (
                            <div className="producto-imagen-placeholder">{producto.nombre.charAt(0)}</div>
                        ) : (
                            <img
                                src={`/${producto.imagen}`}
                                alt={producto.nombre}
                                className="detalle-imagen"
                                onError={() => setImgError(true)}
                            />
                        )}
                    </div>
                    <div className="detalle-info">
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
        </main>
    )
}
