'use client'

import { CarritoProvider, useCarrito } from '../context/CartContext'
import Header from './Header'
import Footer from './Footer'
import ModalCarrito from './ModalCarrito'
import Toast from './Toast'
import CelebracionCompra from './CelebracionCompra'

function ShellInner({ children }) {
    const {
        totalItems,
        modalAbierto,
        setModalAbierto,
        carrito,
        eliminarDelCarrito,
        actualizarCantidad,
        finalizarCompra,
        celebrando,
        setCelebrando,
        toast,
    } = useCarrito()

    return (
        <>
            <Header totalItems={totalItems} onOpenCarrito={() => setModalAbierto(true)} />
            {children}
            <Footer />
            <ModalCarrito
                abierto={modalAbierto}
                carrito={carrito}
                onClose={() => setModalAbierto(false)}
                onEliminar={eliminarDelCarrito}
                onActualizarCantidad={actualizarCantidad}
                onComprar={finalizarCompra}
            />
            <Toast visible={toast.visible} mensaje={toast.mensaje} />
            {celebrando && <CelebracionCompra onTerminar={() => setCelebrando(false)} />}
        </>
    )
}

export default function ClientShell({ children }) {
    return (
        <CarritoProvider>
            <ShellInner>{children}</ShellInner>
        </CarritoProvider>
    )
}
