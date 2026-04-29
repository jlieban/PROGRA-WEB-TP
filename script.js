function crearEstado(inicial) {
    let valor = inicial;
    const listeners = [];

    function getValor() { return valor; }

    function setValor(nuevoValor) {
        valor = nuevoValor;
        listeners.forEach(listener => listener(valor));
    }

    function suscribir(listener) {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    }

    return [getValor, setValor, suscribir];
}

const [getCarrito, setCarrito, suscribirCarrito] = crearEstado([]);

// Los productos ya no están hardcodeados acá: los traemos con fetch desde data.json.
// Empezamos con un array vacío y lo llenamos cuando llega la respuesta del servidor.
let datosProductos = [];

// Función asincrónica que pide el archivo data.json al servidor.
// Es async porque por dentro usa await — el navegador tarda un tiempo en
// devolvernos el archivo y necesitamos esperar la respuesta sin congelar la página.
async function cargarProductos() {
    try {
        // 1) fetch devuelve una Promise que se resuelve con un objeto Response.
        //    await pausa esta función hasta que la promesa se resuelva.
        const respuesta = await fetch('data.json');

        // 2) Si el servidor respondió con error (404, 500, etc.), lo detectamos.
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        // 3) .json() también es asincrónica: lee el cuerpo de la respuesta y
        //    lo parsea como JSON. También devuelve una Promise, por eso otro await.
        const datos = await respuesta.json();

        // 4) Guardamos los productos en la variable que usa el resto del script.
        datosProductos = datos.productos;
    } catch (error) {
        // Si algo falla (no hay conexión, archivo inexistente, JSON mal formado),
        // se lo mostramos al usuario en vez de dejar la página rota.
        console.error('No se pudieron cargar los productos:', error);
        gridProductos.innerHTML = '<p class="error-carga">No pudimos cargar los productos. Probá recargar la página.</p>';
    }
}

let gridProductos, modalCarrito, carritoBtn, cerrarModal, cerrarOverlay,
    carritoItems, totalCarrito, cantidadCarrito, btnComprar,
    btnVerProductos, seccionProductos, toastEl;

function inicializarElementos() {
    gridProductos    = document.getElementById('gridProductos');
    modalCarrito     = document.getElementById('modalCarrito');
    carritoBtn       = document.getElementById('carritoBtn');
    cerrarModal      = document.getElementById('cerrarModal');
    cerrarOverlay    = document.getElementById('cerrarOverlay');
    carritoItems     = document.getElementById('carritoItems');
    totalCarrito     = document.getElementById('totalCarrito');
    cantidadCarrito  = document.getElementById('cantidadCarrito');
    btnComprar       = document.getElementById('btnComprar');
    btnVerProductos  = document.getElementById('btnVerProductos');
    seccionProductos = document.getElementById('productos');
    toastEl          = document.getElementById('toast');
}

function mostrarToast(mensaje) {
    toastEl.textContent = mensaje;
    toastEl.classList.add('visible');
    setTimeout(() => toastEl.classList.remove('visible'), 2800);
}

function mostrarProductos() {
    gridProductos.innerHTML = '';
    datosProductos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('producto-imagen-wrapper');

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.classList.add('producto-imagen');
        img.addEventListener('error', () => {
            const placeholder = document.createElement('div');
            placeholder.classList.add('producto-imagen-placeholder');
            placeholder.textContent = producto.nombre.charAt(0);
            img.replaceWith(placeholder);
        });

        const overlay = document.createElement('div');
        overlay.classList.add('producto-descripcion-overlay');
        overlay.innerHTML = `<p>${producto.descripcion}</p>`;

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(overlay);

        const info = document.createElement('div');
        info.classList.add('producto-info');
        info.innerHTML = `
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <p class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</p>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;

        tarjeta.appendChild(imgWrapper);
        tarjeta.appendChild(info);
        gridProductos.appendChild(tarjeta);
    });
}

function agregarAlCarrito(idProducto) {
    const producto = datosProductos.find(p => p.id === idProducto);
    const carritoActual = getCarrito();
    const itemCarrito = carritoActual.find(item => item.id === idProducto);

    const nuevoCarrito = itemCarrito
        ? carritoActual.map(item =>
            item.id === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
          )
        : [...carritoActual, { ...producto, cantidad: 1 }];

    setCarrito(nuevoCarrito);
    mostrarToast(`${producto.nombre} agregado al carrito`);
}

function eliminarDelCarrito(idProducto) {
    setCarrito(getCarrito().filter(item => item.id !== idProducto));
}

function actualizarCarrito() {
    const carritoActual = getCarrito();
    const totalItems = carritoActual.reduce((sum, item) => sum + item.cantidad, 0);
    cantidadCarrito.textContent = totalItems;
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    const carritoActual = getCarrito();
    carritoItems.innerHTML = '';

    if (carritoActual.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
        totalCarrito.textContent = '0.00';
        return;
    }

    carritoActual.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carrito-item');
        div.innerHTML = `
            <div class="carrito-item-info">
                <h3>${item.nombre}</h3>
                <div class="cantidad-controles">
                    <button class="btn-cantidad" data-id="${item.id}" data-accion="decrementar">−</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" data-id="${item.id}" data-accion="incrementar">+</button>
                </div>
                <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            </div>
            <p class="carrito-item-precio">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
        `;
        carritoItems.appendChild(div);
    });

    const total = carritoActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    totalCarrito.textContent = total.toLocaleString('es-AR');
}

function abrirModal() {
    modalCarrito.style.display = 'block';
    actualizarVistaCarrito();
}

function cerrarModalFn() {
    modalCarrito.style.display = 'none';
}

function configurarEventos() {
    carritoBtn.addEventListener('click', abrirModal);
    cerrarModal.addEventListener('click', cerrarModalFn);
    cerrarOverlay.addEventListener('click', cerrarModalFn);

    gridProductos.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-agregar')) {
            agregarAlCarrito(parseInt(event.target.getAttribute('data-id')));
            return;
        }
        const tarjeta = event.target.closest('.tarjeta-producto');
        if (tarjeta) {
            const yaSeleccionada = tarjeta.classList.contains('seleccionado');
            document.querySelectorAll('.tarjeta-producto.seleccionado').forEach(t => t.classList.remove('seleccionado'));
            if (!yaSeleccionada) tarjeta.classList.add('seleccionado');
        }
    });

    carritoItems.addEventListener('click', (event) => {
        const id = parseInt(event.target.getAttribute('data-id'));
        if (event.target.classList.contains('btn-eliminar')) {
            eliminarDelCarrito(id);
        } else if (event.target.classList.contains('btn-cantidad')) {
            const accion = event.target.getAttribute('data-accion');
            const item = getCarrito().find(i => i.id === id);
            actualizarCantidad(id, accion === 'incrementar' ? item.cantidad + 1 : item.cantidad - 1);
        }
    });

    btnVerProductos.addEventListener('click', () => {
        seccionProductos.scrollIntoView({ behavior: 'smooth' });
    });

    btnComprar.addEventListener('click', () => {
        const carritoActual = getCarrito();
        if (carritoActual.length === 0) {
            mostrarToast('El carrito está vacío');
            return;
        }
        const total = carritoActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        setCarrito([]);
        cerrarModalFn();
        mostrarToast(`¡Gracias por tu compra! Total: $${total.toLocaleString('es-AR')}`);
    });
}

// El handler se declara async para poder usar await adentro.
// Sin async, no podríamos pausar la ejecución hasta que termine el fetch.
document.addEventListener('DOMContentLoaded', async () => {
    inicializarElementos();
    configurarEventos();

    // Mostramos un mensaje de "cargando" mientras el fetch va y vuelve.
    // Esto se ve por una fracción de segundo si la red es rápida, pero es
    // importante: prueba que la página no se queda congelada esperando.
    gridProductos.innerHTML = '<p class="cargando">Cargando productos…</p>';

    // ⚠️ IMPORTANTE — SIN AWAIT acá, mostrarProductos() correría con
    // datosProductos todavía vacío y la grilla saldría sin nada.
    // Con await, el navegador "espera" la respuesta del servidor antes de seguir.
    await cargarProductos();

    // Recién ahora datosProductos tiene los datos: podemos pintar la grilla.
    mostrarProductos();
    suscribirCarrito(() => actualizarCarrito());
});
