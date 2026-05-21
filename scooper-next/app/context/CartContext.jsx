'use client'

import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)
    const [celebrando, setCelebrando] = useState(false)
    const [toast, setToast] = useState({ visible: false, mensaje: '' })

    function mostrarToast(mensaje) {
        setToast({ visible: true, mensaje })
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 2800)
    }

    // Ahora recibe el objeto producto completo en vez de solo el id
    function agregarAlCarrito(producto, cantidad = 1) {
        setCarrito(prev => {
            const item = prev.find(i => i.id === producto.id)
            if (item) {
                return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
            }
            return [...prev, { ...producto, cantidad }]
        })
        mostrarToast(`${producto.nombre} agregado al carrito`)
    }

    function eliminarDelCarrito(idProducto) {
        setCarrito(prev => prev.filter(i => i.id !== idProducto))
    }

    function actualizarCantidad(idProducto, cantidad) {
        if (cantidad < 1) {
            eliminarDelCarrito(idProducto)
            return
        }
        setCarrito(prev => prev.map(i => i.id === idProducto ? { ...i, cantidad } : i))
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            mostrarToast('El carrito está vacío')
            return
        }
        setCarrito([])
        setModalAbierto(false)
        setCelebrando(true)
    }

    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0)

    return (
        <CarritoContext.Provider value={{
            carrito,
            totalItems,
            modalAbierto,
            setModalAbierto,
            celebrando,
            setCelebrando,
            toast,
            agregarAlCarrito,
            eliminarDelCarrito,
            actualizarCantidad,
            finalizarCompra,
        }}>
            {children}
        </CarritoContext.Provider>
    )
}

export function useCarrito() {
    return useContext(CarritoContext)
}
