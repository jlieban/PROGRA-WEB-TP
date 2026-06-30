'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ordenId = searchParams.get('orden_id')
    const [orden, setOrden] = useState(null)
    const [procesando, setProcesando] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!ordenId) {
            router.push('/ordenes')
            return
        }
        async function cargar() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) { router.push('/login'); return }

            const res = await fetch('/api/ordenes', {
                headers: { Authorization: `Bearer ${session.access_token}` }
            })
            const ordenes = await res.json()
            const found = ordenes.find(o => o.id == ordenId)
            if (!found) { router.push('/ordenes'); return }
            setOrden(found)
        }
        cargar()
    }, [ordenId])

    const handlePagar = async () => {
        setProcesando(true)
        setError(null)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch('/api/pagos/crear-preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ orden_id: ordenId })
            })
            const result = await res.json()
            if (!res.ok) { setError(result.error); return }

            // Redirigir a Mercado Pago
            window.location.href = result.init_point
        } catch {
            setError('Error de conexión')
        } finally {
            setProcesando(false)
        }
    }

    if (!orden) return <p className="ordenes-cargando">Cargando...</p>

    return (
        <main className="checkout-container">
            <h1 className="checkout-titulo">Checkout</h1>

            <div className="checkout-card">
                <p className="checkout-orden-id">Orden #{orden.id}</p>
                <p className="checkout-estado">Estado: {orden.estado}</p>
                <p className="checkout-total">
                    Total: ${orden.total?.toLocaleString('es-AR')}
                </p>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button
                className={`btn-pagar${procesando || orden.estado !== 'pendiente' ? ' btn-pagar-disabled' : ''}`}
                onClick={handlePagar}
                disabled={procesando || orden.estado !== 'pendiente'}
            >
                {procesando ? 'Redirigiendo...' : 'Pagar con Mercado Pago'}
            </button>

            <p className="checkout-seguro">🔒 Pago seguro procesado por Mercado Pago</p>

            <Link href="/ordenes" className="checkout-volver">
                ← Volver a mis órdenes
            </Link>
        </main>
    )
}

export default function Checkout() {
    return (
        <Suspense fallback={<p className="ordenes-cargando">Cargando...</p>}>
            <CheckoutContent />
        </Suspense>
    )
}
