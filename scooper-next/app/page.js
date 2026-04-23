'use client'

import { useCarrito } from './context/CartContext'
import Hero from './components/Hero'
import GridProductos from './components/GridProductos'
import productos from './datos/productos'

export default function Home() {
    const { carrito, agregarAlCarrito, actualizarCantidad } = useCarrito()

    return (
        <main>
            <Hero />
            <GridProductos
                productos={productos}
                carrito={carrito}
                onAgregar={agregarAlCarrito}
                onActualizarCantidad={actualizarCantidad}
            />
        </main>
    )
}
