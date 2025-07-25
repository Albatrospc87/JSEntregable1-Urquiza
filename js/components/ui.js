class UIComponent {
    static inicializar() {
        // Eventos del modal del carrito
        const modalCarrito = document.getElementById('modal-carrito');
        const carritoIcono = document.getElementById('carrito-icono');
        const cerrarModal = document.querySelector('.cerrar-modal');

        carritoIcono.addEventListener('click', () => {
            CarritoComponent.mostrarCarrito();
        });

        cerrarModal.addEventListener('click', () => {
            modalCarrito.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalCarrito) {
                modalCarrito.style.display = 'none';
            }
        });

        // Eventos de los botones del carrito
        document.getElementById('vaciar-carrito').addEventListener('click', () => {
            Swal.fire({
                title: '¿Vaciar carrito?',
                text: "Todos los productos serán eliminados",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, vaciar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    CarritoComponent.vaciarCarrito();
                    Swal.fire(
                        'Carrito vaciado',
                        'Tu carrito está ahora vacío',
                        'success'
                    );
                }
            });
        });

        document.getElementById('finalizar-compra').addEventListener('click', () => {
            CarritoComponent.finalizarCompra();
        });

        // Eventos de navegación
        document.getElementById('nav-inicio').addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarInicio();
        });

        document.getElementById('nav-productos').addEventListener('click', (e) => {
            e.preventDefault();
            Productos.mostrarCatalogo();
        });

        document.getElementById('btn-explorar').addEventListener('click', () => {
            Productos.mostrarCatalogo();
        });
    }

    static mostrarInicio() {
        const html = `
            <section class="destacados">
                <h2 class="seccion-titulo">Vehículos Destacados</h2>
                <div class="grid-destacados">
                    ${Productos.productos
                        .filter(p => p.destacado)
                        .slice(0, 3)
                        .map(producto => `
                            <div class="destacado-card" data-id="${producto.id}">
                                <div class="destacado-imagen">
                                    <img src="img/productos/${producto.imagen}" alt="${producto.modelo}">
                                </div>
                                <div class="destacado-info">
                                    <h3>${producto.modelo} ${producto.año}</h3>
                                    <p class="destacado-precio">$${producto.precio.toLocaleString('es-AR')}</p>
                                    <button class="btn-agregar-carrito" data-id="${producto.id}">
                                        <i class="fas fa-cart-plus"></i> Agregar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </section>
            
            <section class="financiacion-info">
                <h2 class="seccion-titulo">Financiación Especial</h2>
                <div class="financiacion-content">
                    <div class="financiacion-texto">
                        <p>¡Aprovecha nuestras promociones exclusivas de financiación!</p>
                        <ul>
                            <li>Tasas preferenciales</li>
                            <li>Hasta 48 meses</li>
                            <li>Entrada desde el 20%</li>
                            <li>Aprobación rápida</li>
                        </ul>
                        <button class="btn-primary" id="btn-ver-productos">Ver todos los modelos</button>
                    </div>
                    <div class="financiacion-imagen">
                        <img src="img/financiacion.jpg" alt="Financiación Ford">
                    </div>
                </div>
            </section>
        `;

        document.getElementById('contenido-dinamico').innerHTML = html;

        // Eventos para los productos destacados
        document.querySelectorAll('.destacado-card .btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.target.closest('button').dataset.id;
                const producto = Productos.productos.find(p => p.id == id);
                
                if (producto) {
                    CarritoComponent.agregarProducto(producto);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `${producto.modelo} agregado al carrito`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });

        document.querySelectorAll('.destacado-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const id = card.dataset.id;
                    Productos.mostrarDetalleProducto(id);
                }
            });
        });

        document.getElementById('btn-ver-productos').addEventListener('click', () => {
            Productos.mostrarCatalogo();
        });
    }
}