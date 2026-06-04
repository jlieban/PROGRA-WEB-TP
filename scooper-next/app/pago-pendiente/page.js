'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PagoPendienteContent() {
    const searchParams = useSearchParams()
    const externalReference = searchParams.get('external_reference')

    return (
        <main style={{ maxWidth: 500, margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
            <div style={{
                background: '#fff',
                borderTop: '6px solid #f39c12',
                borderRadius: 8,
                padding: '2rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '4rem' }}>⏳</div>
                <h1 style={{ color: '#f39c12' }}>Pago pendiente</h1>
                <p>Tu pago está siendo procesado.</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Las transferencias bancarias pueden tardar 1-2 días hábiles en confirmarse.
                    Te notificaremos cuando se acredite.
                </p>
                {externalReference && <p style={{ fontSize: '0.9rem', color: '#666' }}>Orden: #{externalReference}</p>}
                <div style={{ marginTop: '1.5rem' }}>
                    <Link href="/ordenes" style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f39c12',
                        color: '#fff',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Ver mis órdenes
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default function PagoPendiente() {
    return (
        <Suspense fallback={<p style={{ padding: '2rem' }}>Cargando...</p>}>
            <PagoPendienteContent />
        </Suspense>
    )
}
