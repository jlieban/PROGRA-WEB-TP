'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useUser } from '../context/UserContext'

export default function Admin() {
    const { usuario, logout } = useUser()
    const router = useRouter()

    function cerrarSesion() {
        Object.keys(localStorage)
            .filter(k => k.startsWith('sb-'))
            .forEach(k => localStorage.removeItem(k))
        window.location.href = '/'
    }
    const [tab, setTab] = useState('ordenes')
    const [ordenes, setOrdenes] = useState([])
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [editando, setEditando] = useState(null)
    const [nuevoProducto, setNuevoProducto] = useState(false)
    const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' })

    useEffect(() => {
        if (usuario === undefined) return // todavía cargando
        if (usuario === null) return // sesión cerrada, el header redirige
        if (usuario.rol === 'admin') cargarDatos()
    }, [usuario?.rol])

    async function getToken() {
        const { data: { session } } = await supabase.auth.getSession()
        return session?.access_token
    }

    async function cargarDatos() {
        setCargando(true)
        const token = await getToken()
        const headers = { Authorization: `Bearer ${token}` }

        const [resOrdenes, resProductos] = await Promise.all([
            fetch('/api/admin/ordenes', { headers }),
            fetch('/api/admin/productos', { headers }),
        ])

        if (resOrdenes.status === 403) { router.push('/'); return }

        setOrdenes(await resOrdenes.json())
        setProductos(await resProductos.json())
        setCargando(false)
    }

    async function actualizarEstadoOrden(id, estado) {
        const token = await getToken()
        await fetch('/api/admin/ordenes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id, estado })
        })
        setOrdenes(prev => prev.map(o => o.id === id ? { ...o, estado } : o))
    }

    async function guardarProducto() {
        const token = await getToken()
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        const body = JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) })

        if (editando) {
            await fetch(`/api/admin/productos/${editando}`, { method: 'PUT', headers, body })
            setProductos(prev => prev.map(p => p.id === editando ? { ...p, ...form, precio: Number(form.precio), stock: Number(form.stock) } : p))
        } else {
            const res = await fetch('/api/admin/productos', { method: 'POST', headers, body })
            const nuevo = await res.json()
            setProductos(prev => [...prev, nuevo])
        }
        setEditando(null)
        setNuevoProducto(false)
        setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' })
    }

    async function eliminarProducto(id) {
        if (!confirm('¿Eliminar este producto?')) return
        const token = await getToken()
        await fetch(`/api/admin/productos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        })
        setProductos(prev => prev.filter(p => p.id !== id))
    }

    function abrirEdicion(producto) {
        setEditando(producto.id)
        setNuevoProducto(false)
        setForm({ nombre: producto.nombre, descripcion: producto.descripcion ?? '', precio: producto.precio, stock: producto.stock, imagen: producto.imagen ?? '' })
    }

    function abrirNuevo() {
        setEditando(null)
        setNuevoProducto(true)
        setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' })
    }

    if (cargando) return <main className="ordenes-container"><p className="ordenes-cargando">Cargando panel...</p></main>

    return (
        <main className="admin-container">
            <div className="admin-header">
                <h1 className="admin-titulo">Panel de administración</h1>
                <button onClick={cerrarSesion} className="btn-cancelar">Cerrar sesión</button>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'ordenes' ? 'admin-tab-activo' : ''}`} onClick={() => setTab('ordenes')}>Órdenes</button>
                <button className={`admin-tab ${tab === 'productos' ? 'admin-tab-activo' : ''}`} onClick={() => setTab('productos')}>Productos</button>
            </div>

            {tab === 'ordenes' && (
                <div className="admin-seccion">
                    {ordenes.length === 0 ? (
                        <p className="admin-vacio">No hay órdenes todavía.</p>
                    ) : (
                        <table className="admin-tabla">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Productos</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenes.map(orden => (
                                    <tr key={orden.id}>
                                        <td>{orden.usuarios?.email ?? '—'}</td>
                                        <td>{new Date(orden.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td>${orden.total?.toLocaleString('es-AR')}</td>
                                        <td className="admin-items">
                                            {orden.orden_items?.map(i => `${i.productos?.nombre} x${i.cantidad}`).join(', ')}
                                        </td>
                                        <td>
                                            <select
                                                className="admin-select"
                                                value={orden.estado}
                                                onChange={e => actualizarEstadoOrden(orden.id, e.target.value)}
                                            >
                                                <option value="pendiente">pendiente</option>
                                                <option value="pagado">pagado</option>
                                                <option value="enviado">enviado</option>
                                                <option value="cancelado">cancelado</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {tab === 'productos' && (
                <div className="admin-seccion">
                    <button className="btn-agregar-producto" onClick={abrirNuevo}>+ Nuevo producto</button>

                    {(editando || nuevoProducto) && (
                        <div className="admin-form">
                            <h3>{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
                            <div className="admin-form-grid">
                                <input placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                                <input placeholder="Precio" type="number" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
                                <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                                <input placeholder="Imagen (nombre del archivo)" value={form.imagen} onChange={e => setForm(f => ({ ...f, imagen: e.target.value }))} />
                                <textarea placeholder="Descripción" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} className="admin-textarea" />
                            </div>
                            <div className="admin-form-botones">
                                <button className="btn-guardar" onClick={guardarProducto}>Guardar</button>
                                <button className="btn-cancelar" onClick={() => { setEditando(null); setNuevoProducto(false) }}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    <table className="admin-tabla">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.nombre}</td>
                                    <td>${p.precio?.toLocaleString('es-AR')}</td>
                                    <td>{p.stock}</td>
                                    <td className="admin-acciones">
                                        <button className="btn-editar" onClick={() => abrirEdicion(p)}>Editar</button>
                                        <button className="btn-eliminar-admin" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}
