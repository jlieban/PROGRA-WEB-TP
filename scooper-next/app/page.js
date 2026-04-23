'use client'

import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import GridProductos from './components/GridProductos'
import ModalCarrito from './components/ModalCarrito'
import ModalProducto from './components/ModalProducto'
import Footer from './components/Footer'
import Toast from './components/Toast'
import CelebracionCompra from './components/CelebracionCompra'
import productos from './datos/productos'

export default function Home() {
    const [carrito, setCarrito] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)
    const [productoDetalle, setProductoDetalle] = useState(null)
    const [celebrando, setCelebrando] = useState(false)
    const [toast, setToast] = useState({ visible: false, mensaje: '' })

    function mostrarToast(mensaje) {
        setToast({ visible: true, mensaje })
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 2800)
    }

    function agregarAlCarrito(idProducto, cantidad = 1) {
        const producto = productos.find(p => p.id === idProducto)
        setCarrito(prev => {
            const item = prev.find(i => i.id === idProducto)
            if (item) {
                return prev.map(i => i.id === idProducto ? { ...i, cantidad: i.cantidad + cantidad } : i)
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
        <>
            <Header totalItems={totalItems} onOpenCarrito={() => setModalAbierto(true)} />
            <main>
                <Hero />
                <GridProductos
                    productos={productos}
                    carrito={carrito}
                    onVerDetalle={setProductoDetalle}
                    onAgregar={agregarAlCarrito}
                    onActualizarCantidad={actualizarCantidad}
                />
            </main>
            <ModalProducto
                producto={productoDetalle}
                onClose={() => setProductoDetalle(null)}
                onAgregar={agregarAlCarrito}
            />
            <ModalCarrito
                abierto={modalAbierto}
                carrito={carrito}
                onClose={() => setModalAbierto(false)}
                onEliminar={eliminarDelCarrito}
                onActualizarCantidad={actualizarCantidad}
                onComprar={finalizarCompra}
            />
            <Footer />
            <Toast visible={toast.visible} mensaje={toast.mensaje} />
            {celebrando && <CelebracionCompra onTerminar={() => setCelebrando(false)} />}
        </>
    )
}
