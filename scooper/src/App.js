import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GridProductos from './components/GridProductos';
import ModalCarrito from './components/ModalCarrito';
import ModalProducto from './components/ModalProducto';
import ModalOrdenes from './components/ModalOrdenes';
import CelebracionCompra from './components/CelebracionCompra';
import Footer from './components/Footer';
import Toast from './components/Toast';
import productos from './datos/productos';

function App() {
    const [carrito, setCarrito] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalOrdenesAbierto, setModalOrdenesAbierto] = useState(false);
    const [ordenes, setOrdenes] = useState([]);
    const [productoDetalle, setProductoDetalle] = useState(null);
    const [celebrando, setCelebrando] = useState(false);
    const [toast, setToast] = useState({ visible: false, mensaje: '' });

    function mostrarToast(mensaje) {
        setToast({ visible: true, mensaje });
        setTimeout(() => setToast({ visible: false, mensaje: '' }), 2800);
    }

    function agregarAlCarrito(idProducto, cantidad = 1) {
        const producto = productos.find(p => p.id === idProducto);
        setCarrito(prev => {
            const item = prev.find(i => i.id === idProducto);
            if (item) {
                return prev.map(i => i.id === idProducto ? { ...i, cantidad: i.cantidad + cantidad } : i);
            }
            return [...prev, { ...producto, cantidad }];
        });
        mostrarToast(`${producto.nombre} agregado al carrito`);
    }

    function eliminarDelCarrito(idProducto) {
        setCarrito(prev => prev.filter(i => i.id !== idProducto));
    }

    function actualizarCantidad(idProducto, cantidad) {
        if (cantidad < 1) {
            eliminarDelCarrito(idProducto);
            return;
        }
        setCarrito(prev => prev.map(i => i.id === idProducto ? { ...i, cantidad } : i));
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            mostrarToast('El carrito está vacío');
            return;
        }
        const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
        const nuevaOrden = {
            items: carrito.map(i => ({ ...i })),
            total,
            fecha: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }),
        };
        setOrdenes(prev => [...prev, nuevaOrden]);
        setCarrito([]);
        setModalAbierto(false);
        setCelebrando(true);
    }

    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

    return (
        <>
            <Header totalItems={totalItems} onOpenCarrito={() => setModalAbierto(true)} onOpenOrdenes={() => setModalOrdenesAbierto(true)} />
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
                producto={productoDetalle}
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
