'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PagoFallidoContent() {
    const searchParams = useSearchParams()
    const externalReference = searchParams.get('external_reference')

    return (
        <main style={{ maxWidth: 500, margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
            <div style={{
                background: '#fff',
                borderTop: '6px solid #e74c3c',
                borderRadius: 8,
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '4rem' }}>❌</div>
                <h1 style={{ color: '#e74c3c' }}>Pago rechazado</h1>
                <p>No pudimos procesar tu pago. Posibles razones:</p>
                <ul style={{ textAlign: 'left', color: '#666', fontSize: '0.9rem' }}>
                    <li>Fondos insuficientes</li>
                    <li>Tarjeta rechazada por el banco</li>
                    <li>Cancelaste el pago</li>
                </ul>
                {externalReference && <p style={{ fontSize: '0.9rem', color: '#666' }}>Orden: #{externalReference}</p>}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    {externalReference && (
                        <Link href={`/checkout?orden_id=${externalReference}`} style={{
                            padding: '0.75rem 1.5rem',
                            background: '#e74c3c',
                            color: '#fff',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>
                            Reintentar pago
                        </Link>
                    )}
                    <Link href="/ordenes" style={{
                        padding: '0.75rem 1.5rem',
                        background: '#eee',
                        color: '#333',
                        borderRadius: 8,
                        textDecoration: 'none'
                    }}>
                        Ver mis órdenes
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default function PagoFallido() {
    return (
        <Suspense fallback={<p style={{ padding: '2rem' }}>Cargando...</p>}>
            <PagoFallidoContent />
        </Suspense>
    )
}
