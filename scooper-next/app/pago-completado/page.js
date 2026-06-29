'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCarrito } from '../context/CartContext'

function PagoCompletadoContent() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get('payment_id')
    const externalReference = searchParams.get('external_reference')
    const [confirmado, setConfirmado] = useState(false)
    const [errorConfirm, setErrorConfirm] = useState(null)
    const { setCelebrando } = useCarrito()

    useEffect(() => {
        if (!paymentId || !externalReference) return

        async function confirmarPago() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const res = await fetch('/api/pagos/confirmar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    payment_id: paymentId,
                    orden_id: externalReference
                })
            })

            if (res.ok) {
                setConfirmado(true)
                setCelebrando(true)
            } else {
                const data = await res.json()
                setErrorConfirm(data.error)
            }
        }

        confirmarPago()
    }, [paymentId, externalReference])

    return (
        <main style={{ maxWidth: 500, margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
            <div style={{
                background: '#fff',
                borderTop: '6px solid #27ae60',
                borderRadius: 8,
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h1 style={{ color: '#27ae60' }}>¡Pago completado!</h1>
                <p>Tu pago fue procesado exitosamente.</p>
                {paymentId && <p style={{ fontSize: '0.9rem', color: '#666' }}>ID de pago: {paymentId}</p>}
                {externalReference && <p style={{ fontSize: '0.9rem', color: '#666' }}>Orden: #{externalReference}</p>}
                {confirmado && <p style={{ fontSize: '0.85rem', color: '#27ae60' }}>✓ Orden actualizada en el sistema</p>}
                {errorConfirm && <p style={{ fontSize: '0.85rem', color: '#e74c3c' }}>Aviso: {errorConfirm}</p>}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link href="/ordenes" style={{
                        padding: '0.75rem 1.5rem',
                        background: '#27ae60',
                        color: '#fff',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Ver mis órdenes
                    </Link>
                    <Link href="/" style={{
                        padding: '0.75rem 1.5rem',
                        background: '#eee',
                        color: '#333',
                        borderRadius: 8,
                        textDecoration: 'none'
                    }}>
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default function PagoCompletado() {
    return (
        <Suspense fallback={<p style={{ padding: '2rem' }}>Cargando...</p>}>
            <PagoCompletadoContent />
        </Suspense>
    )
}
