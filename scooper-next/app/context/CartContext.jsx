'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CarritoContext = createContext(null)

export function CarritoProvider({ children }) {
    const [carrito, setCarrito] = useState([])
    const [modalAbierto, setModalAbierto] = useState(false)
    const [celebrando, setCelebrando] = useState(false)
    const [toast, setToast] = useState({ visible: false, mensaje: '' })
    const router = useRouter()

    function mostrarToast(mensaje) {
        setToast({ visible: true, mensaje })
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 2800)
    }

    // Helper: obtiene el token de la sesión activa para enviarlo a las API routes
    async function getToken() {
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token || null
    }

    // Al cambiar la sesión, sincronizar carrito con la BD
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                // Usuario acaba de loguearse: cargar su carrito desde la BD
                const token = session.access_token
                const res = await fetch('/api/carrito', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    const items = await res.json()
                    // Convertir el formato de BD al formato local
                    const carritoLocal = items.map(item => ({
                        id: item.productos.id,
                        nombre: item.productos.nombre,
                        precio: item.productos.precio,
                        imagen: item.productos.imagen,
                        descripcion: item.productos.descripcion,
                        cantidad: item.cantidad,
                        carritoId: item.id  // ID del registro en la tabla carrito
                    }))
                    setCarrito(carritoLocal)
                }
            } else {
                // Usuario cerró sesión: limpiar carrito local
                setCarrito([])
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function agregarAlCarrito(producto, cantidad = 1) {
        // Validar stock antes de agregar
        const itemEnCarrito = carrito.find(i => i.id === producto.id)
        const cantidadActual = itemEnCarrito?.cantidad ?? 0
        if (producto.stock !== undefined && cantidadActual + cantidad > producto.stock) {
            mostrarToast(`Stock insuficiente (disponible: ${producto.stock - cantidadActual})`)
            return
        }

        // Actualizar estado local inmediatamente (para que se vea rápido en la UI)
        setCarrito(prev => {
            const item = prev.find(i => i.id === producto.id)
            if (item) {
                return prev.map(i => i.id === producto.id
                    ? { ...i, cantidad: i.cantidad + cantidad }
                    : i
                )
            }
            return [...prev, { ...producto, cantidad }]
        })
        mostrarToast(`${producto.nombre} agregado al carrito`)

        // Si el usuario está logueado, sincronizar también con la BD
        const token = await getToken()
        if (token) {
            await fetch('/api/carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ producto_id: producto.id, cantidad })
            })
        }
    }

    async function eliminarDelCarrito(idProducto) {
        setCarrito(prev => prev.filter(i => i.id !== idProducto))

        // Eliminar de la BD si está logueado
        const token = await getToken()
        if (token) {
            // Buscar el carritoId del item para llamar DELETE /api/carrito/[id]
            const item = carrito.find(i => i.id === idProducto)
            if (item?.carritoId) {
                await fetch(`/api/carrito/${item.carritoId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            }
        }
    }

    async function actualizarCantidad(idProducto, cantidad) {
        if (cantidad < 1) {
            eliminarDelCarrito(idProducto)
            return
        }
        // Validar stock
        const item = carrito.find(i => i.id === idProducto)
        if (item?.stock !== undefined && cantidad > item.stock) {
            mostrarToast(`Stock insuficiente (disponible: ${item.stock})`)
            return
        }
        // Actualizar estado local inmediatamente
        setCarrito(prev => prev.map(i => i.id === idProducto ? { ...i, cantidad } : i))

        // Sincronizar con la BD
        const token = await getToken()
        if (token) {
            const item = carrito.find(i => i.id === idProducto)
            if (item?.carritoId) {
                await fetch(`/api/carrito/${item.carritoId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cantidad })
                })
            }
        }
    }

    async function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarToast('El carrito está vacío')
        return false
    }

        const token = await getToken()
        if (!token) {
            mostrarToast('Iniciá sesión para confirmar la compra')
            return false
        }

        // Enviamos los items del carrito local (siempre correcto)
        // El servidor valida precios desde la BD, pero confía en las cantidades del cliente
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: carrito.map(i => ({ producto_id: i.id, cantidad: i.cantidad }))
            })
        })

        if (!res.ok) {
            const datos = await res.json()
            mostrarToast(datos.error || 'Error al confirmar la compra')
            return false
        }

        // La BD ya vació el carrito, limpiamos el estado local también
        const datos = await res.json()
        setCarrito([])
        setModalAbierto(false)

        // Redirigir al checkout con el orden_id
        router.push(`/checkout?orden_id=${datos.orden_id}`)
        return true
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
