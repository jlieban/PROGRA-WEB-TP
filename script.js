// ===== VARIABLES GLOBALES =====
let carrito = [];
let productos = [];

// ===== DATOS DE PRODUCTOS =====
// Array de productos con toda la información necesaria
const datosProductos = [
    {
        "id": 1,
        "nombre": "Chocolate SCOOPER",
        "descripcion": "Chocolate belga de alta calidad, intenso y delicioso",
        "precio": 5.00,
        "imagen": "chocoscooper.png"
    },
    {
        "id": 2,
        "nombre": "Pistacho Siciliano",
        "descripcion": "Pistacho importado, sabor único y sofisticado",
        "precio": 5.75,
        "imagen": "pistachosic.png"
    },
    {
        "id": 3,
        "nombre": "Mango Tropical",
        "descripcion": "Mango maduro con sabor tropical intenso",
        "precio": 4.90,
        "imagen": "mango.png"
    },
    {
        "id": 4,
        "nombre": "Dubaint",
        "descripcion": "Sabor único y premium de Dubaint",
        "precio": 6.00,
        "imagen": "dubaint.png"
    },
    {
        "id": 5,
        "nombre": "Principal",
        "descripcion": "Nuestro sabor principal y estrella",
        "precio": 5.50,
        "imagen": "principal.png"
    },
    {
        "id": 6,
        "nombre": "Chocos Cooper",
        "descripcion": "Versión especial de chocolate con sorpresas",
        "precio": 5.25,
        "imagen": "chocoscooper.png"
    },
    {
        "id": 7,
        "nombre": "DDL",
        "descripcion": "Sabor exclusivo DDL",
        "precio": 5.50,
        "imagen": "ddl.png"
    },
    {
        "id": 8,
        "nombre": "Mango Deluxe",
        "descripcion": "Mango premium seleccionado",
        "precio": 5.15,
        "imagen": "mango.png"
    }
];

// ===== ELEMENTOS DEL DOM =====
const gridProductos = document.getElementById('gridProductos');
const modalCarrito = document.getElementById('modalCarrito');
const carritoBtn = document.getElementById('carritoBtn');
const cerrarModal = document.getElementById('cerrarModal');
const carritoItems = document.getElementById('carritoItems');
const totalCarrito = document.getElementById('totalCarrito');
const cantidadCarrito = document.getElementById('cantidadCarrito');
const btnComprar = document.getElementById('btnComprar');
const btnVerProductos = document.getElementById('btnVerProductos');
const seccionProductos = document.getElementById('productos');

// ===== CARGAR DATOS DE PRODUCTOS =====
// Función para cargar los productos desde el array de datos
function cargarProductos() {
    // Asignar directamente los datos del array
    productos = datosProductos;
    mostrarProductos();
}

// ===== MOSTRAR PRODUCTOS =====
// Función para mostrar los productos en el grid
function mostrarProductos() {
    gridProductos.innerHTML = '';
    
    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
        
        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">$${producto.precio.toFixed(2)}</p>
                <button class="btn-agregar" data-id="${producto.id}">
                    Agregar al carrito
                </button>
            </div>
        `;
        
        gridProductos.appendChild(tarjeta);
    });
}

// ===== GESTIÓN DEL CARRITO =====
// Función para agregar productos al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    
    // Buscar si el producto ya existe en el carrito
    const itemCarrito = carrito.find(item => item.id === idProducto);
    
    if (itemCarrito) {
        // Si existe, aumentar la cantidad
        itemCarrito.cantidad++;
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    // Actualizar el carrito en la interfaz
    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();
}

// Función para actualizar la cantidad de un producto en el carrito
function actualizarCantidad(idProducto, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(idProducto);
    } else {
        const item = carrito.find(item => item.id === idProducto);
        if (item) {
            item.cantidad = nuevaCantidad;
        }
    }
    actualizarCarrito();
}

// ===== ACTUALIZAR INTERFAZ DEL CARRITO =====
// Función para actualizar todo lo relacionado con el carrito
function actualizarCarrito() {
    // Actualizar cantidad de items en el botón
    cantidadCarrito.textContent = carrito.length;
    
    // Actualizar vista del carrito modal
    actualizarVistaCarrito();
}

// Función para actualizar la vista del modal del carrito
function actualizarVistaCarrito() {
    // Limpiar contenedor de items
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; color: #9CA3AF;">El carrito está vacío</p>';
        totalCarrito.textContent = '0.00';
        return;
    }
    
    // Mostrar cada item del carrito
    carrito.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        
        const subtotal = item.precio * item.cantidad;
        
        div.innerHTML = `
            <div class="carrito-item-info">
                <h3>${item.nombre}</h3>
                <p class="carrito-item-cantidad">Cantidad: ${item.cantidad}</p>
            </div>
            <div style="text-align: right;">
                <p class="carrito-item-precio">$${subtotal.toFixed(2)}</p>
                <button class="btn-eliminar" data-id="${item.id}" style="background: #EF4444; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Eliminar</button>
            </div>
        `;
        
        carritoItems.appendChild(div);
    });
    
    // Calcular total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalCarrito.textContent = total.toFixed(2);
}

// ===== EVENTOS DEL MODAL =====
// Abrir modal al hacer clic en el botón del carrito
carritoBtn.addEventListener('click', () => {
    modalCarrito.style.display = 'block';
    actualizarVistaCarrito();
});

// Cerrar modal al hacer clic en la X
cerrarModal.addEventListener('click', () => {
    modalCarrito.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del modal-content
window.addEventListener('click', (event) => {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
});

// ===== EVENT DELEGATION PARA BOTONES DE PRODUCTOS =====
// Delegamos los eventos de clic en los botones de productos
gridProductos.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-agregar')) {
        const idProducto = parseInt(event.target.getAttribute('data-id'));
        agregarAlCarrito(idProducto);
    }
});

// ===== EVENT DELEGATION PARA BOTONES DE ELIMINAR DEL CARRITO =====
// Delegamos los eventos de clic en los botones de eliminar
carritoItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-eliminar')) {
        const idProducto = parseInt(event.target.getAttribute('data-id'));
        eliminarDelCarrito(idProducto);
    }
});

// ===== EVENTO BOTÓN VER PRODUCTOS =====
// Scroll suave a la sección de productos
btnVerProductos.addEventListener('click', () => {
    seccionProductos.scrollIntoView({ behavior: 'smooth' });
});

// ===== COMPRA =====
// Evento del botón comprar
btnComprar.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    alert(`¡Gracias por tu compra! Total: $${total.toFixed(2)}`);
    
    // Vaciar carrito
    carrito = [];
    actualizarCarrito();
    modalCarrito.style.display = 'none';
});

// ===== INICIALIZAR LA PÁGINA =====
// Cargar productos cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});
