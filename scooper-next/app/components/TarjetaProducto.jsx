'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '../context/UserContext'

export default function TarjetaProducto({ producto, cantidadEnCarrito, onAgregar, onActualizarCantidad }) {
    const [imgError, setImgError] = useState(false)
    const { usuario } = useUser()
    const esAdmin = usuario?.rol === 'admin'

    return (
        <div className="tarjeta-producto">
            <Link href={`/producto/${producto.id}`} className="producto-imagen-wrapper">
                {imgError ? (
                    <div className="producto-imagen-placeholder">{producto.nombre.charAt(0)}</div>
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
            </Link>
            <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-precio">${producto.precio.toLocaleString('es-AR')}</p>
                <div className="tarjeta-botones">
                    {!esAdmin && (
                        producto.stock === 0 ? (
                            <button className="btn-agregar btn-sin-stock" disabled>Sin stock</button>
                        ) : cantidadEnCarrito > 0 ? (
                            <div className="tarjeta-cantidad">
                                <button className="btn-cantidad" onClick={() => onActualizarCantidad(producto.id, cantidadEnCarrito - 1)}>−</button>
                                <span>{cantidadEnCarrito}</span>
                                <button className="btn-cantidad" onClick={() => onActualizarCantidad(producto.id, cantidadEnCarrito + 1)}>+</button>
                            </div>
                        ) : (
                            <button className="btn-agregar" onClick={() => onAgregar(producto)}>
                                Agregar al carrito
                            </button>
                        )
                    )}
                    <Link href={`/producto/${producto.id}`} className="btn-detalle">
                        Ver detalle
                    </Link>
                </div>
            </div>
        </div>
    )
}
