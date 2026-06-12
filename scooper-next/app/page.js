'use client'

import { useEffect, useState } from 'react'
import { useCarrito } from './context/CartContext'
import Hero from './components/Hero'
import GridProductos from './components/GridProductos'

export default function Home() {
    const { carrito, agregarAlCarrito, actualizarCantidad } = useCarrito()

    // Estado local para los productos. Empezamos con array vacío:
    // se va a llenar cuando termine el fetch.
    const [productos, setProductos] = useState([])

    // Estado para mostrar "Cargando…" mientras la respuesta no llegó.
    const [cargando, setCargando] = useState(true)

    // Estado para mostrar un mensaje si el fetch falla.
    const [error, setError] = useState(null)

    // useEffect con array de dependencias vacío [] → se ejecuta UNA SOLA VEZ
    // cuando el componente Home aparece por primera vez en pantalla (montaje).
    // Es el lugar correcto para hacer pedidos al servidor: si lo pusiéramos
    // afuera de useEffect, se ejecutaría en cada re-render.
    useEffect(() => {
        async function cargarProductos() {
            try {
                // Pedimos el JSON que vive en /public/productos.json.
                // Next.js sirve la carpeta /public en la raíz del sitio,
                // así que la URL es simplemente "/productos.json".
                const respuesta = await fetch('/api/productos')

                if (!respuesta.ok) {
                    throw new Error(`Error HTTP: ${respuesta.status}`)
                }

                // .json() también es asincrónica: lee el cuerpo y lo parsea.
                const datos = await respuesta.json()

                // Guardamos los productos en el estado. Esto dispara un
                // re-render automático del componente con los datos nuevos.
                setProductos(datos)
            } catch (err) {
                console.error('No se pudieron cargar los productos:', err)
                setError('No pudimos cargar los productos. Probá recargar la página.')
            } finally {
                // Pase lo que pase (éxito o error), salimos del estado "Cargando".
                setCargando(false)
            }
        }

        cargarProductos()
    }, []) // ← este array vacío es CLAVE: dice "ejecutar solo al montar"

    // Una vez que el contenido cargó, scrollear al hash de la URL si existe.
    // Necesario porque la página es client-side: cuando el navegador procesa
    // el hash (ej: /#sabores), el elemento todavía no existe en el DOM.
    useEffect(() => {
        if (!cargando && window.location.hash) {
            const el = document.querySelector(window.location.hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
    }, [cargando])

    return (
        <main>
            <Hero />
            {cargando && <p className="cargando">Cargando productos…</p>}
            {error && <p className="error-carga">{error}</p>}
            {!cargando && !error && (
                <GridProductos
                    productos={productos}
                    carrito={carrito}
                    onAgregar={agregarAlCarrito}
                    onActualizarCantidad={actualizarCantidad}
                />
            )}
        </main>
    )
}
