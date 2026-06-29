import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GridProductos from './components/GridProductos';
import ModalCarrito from './components/ModalCarrito';
import ModalProducto from './components/ModalProducto';
import ModalOrdenes from './components/ModalOrdenes';
import ModalAuth from './components/ModalAuth';
import CelebracionCompra from './components/CelebracionCompra';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import productosIniciales from './datos/productos';

function App() {
    // ── Catálogo ──
    const [productos, setProductos] = useState(productosIniciales);

    // ── Sesión unificada ──
    // null → sin sesión
    // { tipo: 'usuario', usuario, email } → cliente
    // { tipo: 'admin' }                  → administrador
    const [sesion, setSesion]             = useState(null);
    const [vistaAdmin, setVistaAdmin]     = useState(false);
    const [usuarios, setUsuarios]         = useState([]);
    const [modalAuthAbierto, setModalAuthAbierto] = useState(false);
    const [modoAuth, setModoAuth]         = useState('login');

    // ── Tienda ──
    const [carrito, setCarrito]                         = useState([]);
    const [modalAbierto, setModalAbierto]               = useState(false);
    const [modalOrdenesAbierto, setModalOrdenesAbierto] = useState(false);
    const [ordenes, setOrdenes]                         = useState([]);
    const [productoDetalle, setProductoDetalle]         = useState(null);
    const [celebrando, setCelebrando]                   = useState(false);
    const [toast, setToast]                             = useState({ visible: false, mensaje: '' });

    /* ── Toast ── */
    function mostrarToast(mensaje) {
        setToast({ visible: true, mensaje });
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 2800);
    }

    /* ── Auth ── */
    function abrirAuth(modo = 'login') {
        setModoAuth(modo);
        setModalAuthAbierto(true);
    }

    function handleLoginAdmin() {
        setSesion({ tipo: 'admin' });
        setVistaAdmin(true);
    }

    function handleLoginUsuario(usuario) {
        setSesion({ tipo: 'usuario', ...usuario });
        mostrarToast(`¡Bienvenido/a de vuelta, ${usuario.usuario}!`);
    }

    function handleRegistro(nuevoUsuario) {
        setUsuarios(prev => [...prev, nuevoUsuario]);
        setSesion({ tipo: 'usuario', ...nuevoUsuario });
        mostrarToast(`¡Bienvenido/a, ${nuevoUsuario.usuario}!`);
    }

    function handleLogout() {
        setSesion(null);
        setVistaAdmin(false);
        mostrarToast('Sesión cerrada');
    }

    /* ── Carrito ── */
    function agregarAlCarrito(idProducto, cantidad = 1) {
        const producto = productos.find(p => p.id === idProducto);
        if (!producto) return;
        if (producto.stock < cantidad) { mostrarToast('Stock insuficiente'); return; }

        setProductos(prev =>
            prev.map(p => p.id === idProducto ? { ...p, stock: p.stock - cantidad } : p)
        );
        setCarrito(prev => {
            const item = prev.find(i => i.id === idProducto);
            if (item) return prev.map(i => i.id === idProducto ? { ...i, cantidad: i.cantidad + cantidad } : i);
            return [...prev, { ...producto, cantidad }];
        });
        mostrarToast(`${producto.nombre} agregado al carrito`);
    }

    function eliminarDelCarrito(idProducto) {
        const item = carrito.find(i => i.id === idProducto);
        if (item) {
            setProductos(prev =>
                prev.map(p => p.id === idProducto ? { ...p, stock: p.stock + item.cantidad } : p)
            );
        }
        setCarrito(prev => prev.filter(i => i.id !== idProducto));
    }

    function actualizarCantidad(idProducto, cantidad) {
        if (cantidad < 1) { eliminarDelCarrito(idProducto); return; }
        const item = carrito.find(i => i.id === idProducto);
        if (!item) return;
        const diff = cantidad - item.cantidad;
        if (diff > 0) {
            const producto = productos.find(p => p.id === idProducto);
            if (!producto || producto.stock < diff) { mostrarToast('Stock insuficiente'); return; }
            setProductos(prev => prev.map(p => p.id === idProducto ? { ...p, stock: p.stock - diff } : p));
        } else if (diff < 0) {
            setProductos(prev => prev.map(p => p.id === idProducto ? { ...p, stock: p.stock + Math.abs(diff) } : p));
        }
        setCarrito(prev => prev.map(i => i.id === idProducto ? { ...i, cantidad } : i));
    }

    function finalizarCompra() {
        if (carrito.length === 0) { mostrarToast('El carrito está vacío'); return; }
        if (sesion?.tipo !== 'usuario') {
            mostrarToast('Iniciá sesión para finalizar la compra');
            setModalAbierto(false);
            abrirAuth('login');
            return;
        }
        const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
        setOrdenes(prev => [...prev, {
            items:   carrito.map(i => ({ ...i })),
            total,
            fecha:   new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
            estado:  'pendiente',
            usuario: sesion.usuario,
        }]);
        setCarrito([]);
        setModalAbierto(false);
        setCelebrando(true);
    }

    /* ── Render ── */
    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

    // Vista admin
    if (vistaAdmin && sesion?.tipo === 'admin') {
        return (
            <>
                <AdminPanel
                    productos={productos}
                    setProductos={setProductos}
                    ordenes={ordenes}
                    setOrdenes={setOrdenes}
                    onLogout={handleLogout}
                />
                <Toast visible={toast.visible} mensaje={toast.mensaje} />
            </>
        );
    }

    // Vista tienda
    return (
        <>
            <ModalAuth
                abierto={modalAuthAbierto}
                modo={modoAuth}
                onClose={() => setModalAuthAbierto(false)}
                onLoginUsuario={handleLoginUsuario}
                onLoginAdmin={handleLoginAdmin}
                onRegistro={handleRegistro}
                usuarios={usuarios}
            />

            <Header
                totalItems={totalItems}
                onOpenCarrito={() => setModalAbierto(true)}
                onOpenOrdenes={() => setModalOrdenesAbierto(true)}
                sesion={sesion}
                onOpenAuth={abrirAuth}
                onLogout={handleLogout}
            />

            <main>
                <Hero />
                <GridProductos
                    productos={productos}
                    carrito={carrito}
                    onVerDetalle={setProductoDetalle}
                    onAgregar={agregarAlCarrito}
                    onActualizarCantidad={actualizarCantidad}
                />
            </main>

            <ModalProducto
                producto={productoDetalle ? productos.find(p => p.id === productoDetalle.id) || null : null}
                onClose={() => setProductoDetalle(null)}
                onAgregar={agregarAlCarrito}
            />
            <ModalCarrito
                abierto={modalAbierto}
                carrito={carrito}
                onClose={() => setModalAbierto(false)}
                onEliminar={eliminarDelCarrito}
                onActualizarCantidad={actualizarCantidad}
                onComprar={finalizarCompra}
            />
            <ModalOrdenes
                abierto={modalOrdenesAbierto}
                ordenes={ordenes}
                onClose={() => setModalOrdenesAbierto(false)}
            />
            <Footer />
            <Toast visible={toast.visible} mensaje={toast.mensaje} />
            {celebrando && <CelebracionCompra onTerminar={() => setCelebrando(false)} />}
        </>
    );
}

export default App;
