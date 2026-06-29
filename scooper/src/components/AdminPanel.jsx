import { useState } from 'react';

/* ── Formulario de producto (crear / editar) ── */
function FormProducto({ producto, onGuardar, onCancelar }) {
    const [form, setForm] = useState({
        nombre:      producto?.nombre      || '',
        descripcion: producto?.descripcion || '',
        precio:      producto?.precio      || '',
        stock:       producto?.stock       ?? 10,
        imagen:      producto?.imagen      || '',
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onGuardar({
            ...form,
            precio: Number(form.precio),
            stock:  Number(form.stock),
        });
    }

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
                <div className="admin-campo">
                    <label>Nombre</label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Frutilla rosada"
                    />
                </div>
                <div className="admin-campo">
                    <label>Precio ($)</label>
                    <input
                        name="precio"
                        type="number"
                        value={form.precio}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="10000"
                    />
                </div>
                <div className="admin-campo">
                    <label>Stock</label>
                    <input
                        name="stock"
                        type="number"
                        value={form.stock}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                <div className="admin-campo">
                    <label>Imagen (nombre de archivo o URL)</label>
                    <input
                        name="imagen"
                        value={form.imagen}
                        onChange={handleChange}
                        placeholder="Ej: frutilla.png o https://..."
                    />
                </div>
                <div className="admin-campo admin-campo-full">
                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descripción del sabor..."
                    />
                </div>
            </div>
            <div className="admin-form-acciones">
                <button type="submit" className="btn-admin-guardar">Guardar</button>
                <button type="button" className="btn-admin-cancelar" onClick={onCancelar}>Cancelar</button>
            </div>
        </form>
    );
}

/* ── Tab de Productos ── */
function TabProductos({ productos, setProductos }) {
    const [formAbierto, setFormAbierto] = useState(false);
    const [editando, setEditando]       = useState(null);

    function handleNuevo() {
        setEditando(null);
        setFormAbierto(true);
    }

    function handleEditar(producto) {
        setEditando(producto);
        setFormAbierto(true);
    }

    function handleEliminar(id) {
        if (window.confirm('¿Eliminar este producto?')) {
            setProductos(prev => prev.filter(p => p.id !== id));
        }
    }

    function handleGuardar(data) {
        if (editando) {
            setProductos(prev => prev.map(p => p.id === editando.id ? { ...p, ...data } : p));
        } else {
            const nuevoId = productos.length > 0
                ? Math.max(...productos.map(p => p.id)) + 1
                : 1;
            setProductos(prev => [...prev, { id: nuevoId, ...data }]);
        }
        setFormAbierto(false);
        setEditando(null);
    }

    function handleCancelar() {
        setFormAbierto(false);
        setEditando(null);
    }

    function ajustarStock(id, delta) {
        setProductos(prev =>
            prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
        );
    }

    return (
        <div className="admin-tab-content">
            <div className="admin-tab-header">
                <h3>Productos <span className="admin-count">({productos.length})</span></h3>
                <button className="btn-admin-nuevo" onClick={handleNuevo}>+ Nuevo producto</button>
            </div>

            {formAbierto && (
                <div className="admin-form-container">
                    <h4 className="admin-form-titulo">
                        {editando ? `Editar — ${editando.nombre}` : 'Nuevo producto'}
                    </h4>
                    <FormProducto
                        producto={editando}
                        onGuardar={handleGuardar}
                        onCancelar={handleCancelar}
                    />
                </div>
            )}

            {productos.length === 0 ? (
                <p className="admin-vacio">No hay productos. Creá uno con el botón de arriba.</p>
            ) : (
                <table className="admin-tabla">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id} className={p.stock === 0 ? 'admin-fila-agotada' : ''}>
                                <td className="admin-td-id">#{p.id}</td>
                                <td>
                                    <img
                                        src={p.imagen}
                                        alt={p.nombre}
                                        className="admin-producto-img"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                </td>
                                <td>
                                    <span className="admin-producto-nombre">{p.nombre}</span>
                                    <span className="admin-producto-desc">
                                        {p.descripcion.length > 65
                                            ? p.descripcion.substring(0, 65) + '…'
                                            : p.descripcion}
                                    </span>
                                </td>
                                <td className="admin-td-precio">
                                    ${p.precio.toLocaleString('es-AR')}
                                </td>
                                <td>
                                    <div className="admin-stock-control">
                                        <button
                                            className="btn-stock"
                                            onClick={() => ajustarStock(p.id, -1)}
                                            disabled={p.stock === 0}
                                        >−</button>
                                        <span className={p.stock === 0 ? 'admin-stock-cero' : 'admin-stock-num'}>
                                            {p.stock}
                                        </span>
                                        <button
                                            className="btn-stock"
                                            onClick={() => ajustarStock(p.id, 1)}
                                        >+</button>
                                    </div>
                                    {p.stock === 0 && (
                                        <span className="admin-badge-agotado">Sin stock</span>
                                    )}
                                </td>
                                <td>
                                    <div className="admin-acciones">
                                        <button
                                            className="btn-admin-editar"
                                            onClick={() => handleEditar(p)}
                                        >Editar</button>
                                        <button
                                            className="btn-admin-eliminar"
                                            onClick={() => handleEliminar(p.id)}
                                        >Eliminar</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

/* ── Tab de Órdenes ── */
const ESTADOS_ORDEN = ['pendiente', 'en preparación', 'entregado', 'cancelado'];

function TabOrdenes({ ordenes, setOrdenes }) {
    function cambiarEstado(idx, nuevoEstado) {
        setOrdenes(prev =>
            prev.map((o, i) => i === idx ? { ...o, estado: nuevoEstado } : o)
        );
    }

    const totalVentas = ordenes
        .filter(o => o.estado !== 'cancelado')
        .reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="admin-tab-content">
            <div className="admin-tab-header">
                <h3>Órdenes <span className="admin-count">({ordenes.length})</span></h3>
                {ordenes.length > 0 && (
                    <span className="admin-ventas-total">
                        Total vendido: <strong>${totalVentas.toLocaleString('es-AR')}</strong>
                    </span>
                )}
            </div>

            {ordenes.length === 0 ? (
                <p className="admin-vacio">No hay órdenes todavía.</p>
            ) : (
                <div className="admin-ordenes-lista">
                    {[...ordenes].reverse().map((orden, revIdx) => {
                        const idx = ordenes.length - 1 - revIdx;
                        const estado = orden.estado || 'pendiente';
                        return (
                            <div
                                key={idx}
                                className={`admin-orden-card admin-orden-${estado.replace(' ', '-')}`}
                            >
                                <div className="admin-orden-top">
                                    <div className="admin-orden-meta">
                                        <span className="admin-orden-num">Orden #{idx + 1}</span>
                                        <span className="admin-orden-fecha">{orden.fecha}</span>
                                    </div>
                                    <select
                                        className={`admin-estado-select admin-estado-${estado.replace(' ', '-')}`}
                                        value={estado}
                                        onChange={e => cambiarEstado(idx, e.target.value)}
                                    >
                                        {ESTADOS_ORDEN.map(e => (
                                            <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <ul className="admin-orden-items">
                                    {orden.items.map(item => (
                                        <li key={item.id} className="admin-orden-linea">
                                            <span>{item.nombre} × {item.cantidad}</span>
                                            <span>${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="admin-orden-total">
                                    <span>Total</span>
                                    <strong>${orden.total.toLocaleString('es-AR')}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Panel principal ── */
function AdminPanel({ productos, setProductos, ordenes, setOrdenes, onLogout }) {
    const [tab, setTab] = useState('productos');

    const pendientes = ordenes.filter(o => (o.estado || 'pendiente') === 'pendiente').length;

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <div className="admin-header-marca">
                    <span className="admin-logo">SCOOPER</span>
                    <span className="admin-subtitulo">Panel de administración</span>
                </div>
                <button className="btn-admin-logout" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>

            <div className="admin-tabs-bar">
                <button
                    className={`admin-tab-btn ${tab === 'productos' ? 'activo' : ''}`}
                    onClick={() => setTab('productos')}
                >
                    Productos
                </button>
                <button
                    className={`admin-tab-btn ${tab === 'ordenes' ? 'activo' : ''}`}
                    onClick={() => setTab('ordenes')}
                >
                    Órdenes
                    {pendientes > 0 && (
                        <span className="admin-tab-badge">{pendientes}</span>
                    )}
                </button>
            </div>

            <div className="admin-contenido">
                {tab === 'productos' && (
                    <TabProductos productos={productos} setProductos={setProductos} />
                )}
                {tab === 'ordenes' && (
                    <TabOrdenes ordenes={ordenes} setOrdenes={setOrdenes} />
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
