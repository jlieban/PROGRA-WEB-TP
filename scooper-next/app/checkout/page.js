'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Checkout() {
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
            // Semana 13: acá se redirigirá a result.init_point de Mercado Pago
            alert('Estructura lista. Integración con Mercado Pago se completa en semana 13.')
        } catch {
            setError('Error de conexión')
        } finally {
            setProcesando(false)
        }
    }

    if (!orden) return <p style={{ padding: '2rem' }}>Cargando...</p>

    return (
        <main style={{ maxWidth: 500, margin: '2rem auto', padding: '0 1rem' }}>
            <h1>Checkout</h1>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: '1.5rem',
                marginBottom: '1.5rem',
                background: '#f9f9f9'
            }}>
                <p><strong>Orden #{orden.id}</strong></p>
                <p>Estado: <span style={{ textTransform: 'capitalize' }}>{orden.estado}</span></p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Total: ${orden.total?.toLocaleString('es-AR')}
                </p>
            </div>

            {error && (
                <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
            )}

            <button
                onClick={handlePagar}
                disabled={procesando || orden.estado !== 'pendiente'}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: procesando ? '#ccc' : '#009ee3',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '1rem',
                    cursor: procesando ? 'not-allowed' : 'pointer'
                }}
            >
                {procesando ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>

            <Link href="/ordenes" style={{ display: 'block', marginTop: '1rem', textAlign: 'center', color: '#555' }}>
                ← Volver a mis órdenes
            </Link>
        </main>
    )
}
