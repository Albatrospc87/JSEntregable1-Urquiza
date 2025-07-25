class ProductosComponent {
    constructor() {
        this.productos = [];
        this.categorias = [];
    }

    async inicializar() {
        const data = await FordAPI.obtenerProductos();
        this.productos = data.vehiculos;
        this.categorias = data.categorias;
    }

    mostrarCatalogo(filtroCategoria = null) {
        const contenedor = document.getElementById('contenido-dinamico');
        
        let productosFiltrados = this.productos;
        if (filtroCategoria) {
            productosFiltrados = this.productos.filter(p => p.categoria === filtroCategoria);
        }

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<p class="mensaje">No hay vehículos disponibles en esta categoría</p>';
            return;
        }

        let html = `
            <h2 class="seccion-titulo">${filtroCategoria ? this.obtenerNombreCategoria(filtroCategoria) : 'Nuestros Vehículos'}</h2>
            <div class="filtros">
                <button class="btn-filtro active" data-categoria="todos">Todos</button>
                ${this.categorias.map(cat => 
                    `<button class="btn-filtro" data-categoria="${cat.id}">${cat.nombre}</button>`
                ).join('')}
            </div>
            <div class="grid-productos">
        `;

        productosFiltrados.forEach(producto => {
            html += `
                <div class="producto-card" data-id="${producto.id}">
                    <div class="producto-imagen">
                        <img src="img/productos/${producto.imagen}" alt="${producto.modelo}">
                        ${producto.destacado ? '<span class="destacado">Destacado</span>' : ''}
                    </div>
                    <div class="producto-info">
                        <h3>${producto.modelo} ${producto.año}</h3>
                        <p class="producto-desc">${producto.descripcion.substring(0, 100)}...</p>
                        <p class="producto-precio">$${producto.precio.toLocaleString('es-AR')}</p>
                        <p class="producto-stock">${producto.stock > 0 ? `Disponible (${producto.stock} unidades)` : 'Sin stock'}</p>
                        <button class="btn-agregar-carrito" data-id="${producto.id}">
                            <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                        <button class="btn-detalles" data-id="${producto.id}">
                            Ver detalles
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        contenedor.innerHTML = html;

        // Agregar eventos a los botones de filtro
        document.querySelectorAll('.btn-filtro').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoria = e.target.dataset.categoria;
                document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (categoria === 'todos') {
                    this.mostrarCatalogo();
                } else {
                    this.mostrarCatalogo(categoria);
                }
            });
        });

        // Agregar eventos a los botones de productos
        this.agregarEventosProductos();
    }

    obtenerNombreCategoria(id) {
        const categoria = this.categorias.find(c => c.id === id);
        return categoria ? categoria.nombre : id;
    }

    mostrarDetalleProducto(id) {
        const producto = this.productos.find(p => p.id == id);
        if (!producto) return;

        const html = `
            <div class="producto-detalle">
                <button class="btn-volver" id="btn-volver-productos">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <div class="detalle-contenido">
                    <div class="detalle-imagenes">
                        <img src="img/productos/${producto.imagen}" alt="${producto.modelo}">
                    </div>
                    <div class="detalle-info">
                        <h2>${producto.modelo} ${producto.año}</h2>
                        <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
                        <p class="categoria">${this.obtenerNombreCategoria(producto.categoria)}</p>
                        
                        <div class="especificaciones">
                            <h3>Especificaciones</h3>
                            <p>${producto.descripcion}</p>
                            
                            <div class="colores">
                                <h4>Colores disponibles:</h4>
                                <div class="colores-container">
                                    ${producto.colores.map(color => 
                                        `<span class="color-option" style="background-color: ${this.getColorHex(color)}"></span>`
                                    ).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <div class="acciones">
                            <button class="btn-primary btn-agregar-carrito" data-id="${producto.id}">
                                <i class="fas fa-cart-plus"></i> Agregar al carrito
                            </button>
                            <button class="btn-secondary" id="btn-simular-financiacion" data-id="${producto.id}">
                                Simular financiación
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('contenido-dinamico').innerHTML = html;

        // Evento para volver
        document.getElementById('btn-volver-productos').addEventListener('click', () => {
            this.mostrarCatalogo();
        });

        // Evento para financiación
        document.getElementById('btn-simular-financiacion').addEventListener('click', () => {
            this.mostrarSimuladorFinanciacion(producto);
        });
    }

    mostrarSimuladorFinanciacion(producto) {
        const html = `
            <div class="simulador-financiacion">
                <h2>Simulador de Financiación</h2>
                <p>${producto.modelo} - $${producto.precio.toLocaleString('es-AR')}</p>
                
                <form id="form-financiacion">
                    <div class="form-group">
                        <label for="cuotas">Plazo de financiación:</label>
                        <select id="cuotas" required>
                            <option value="">Seleccione...</option>
                            <option value="12">12 meses</option>
                            <option value="24">24 meses</option>
                            <option value="36">36 meses</option>
                            <option value="48">48 meses</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="entrada">Entrada inicial (%):</label>
                        <input type="range" id="entrada" min="0" max="50" value="20" step="5">
                        <span id="entrada-valor">20%</span>
                    </div>
                    
                    <button type="submit" class="btn-primary">Calcular</button>
                </form>
                
                <div id="resultado-financiacion" class="resultado-financiacion"></div>
            </div>
        `;

        Swal.fire({
            title: `Financiación ${producto.modelo}`,
            html: html,
            width: '800px',
            showConfirmButton: false,
            showCloseButton: true
        });

        // Actualizar valor del porcentaje de entrada
        document.getElementById('entrada').addEventListener('input', (e) => {
            document.getElementById('entrada-valor').textContent = `${e.target.value}%`;
        });

        // Manejar el formulario
        document.getElementById('form-financiacion').addEventListener('submit', async (e) => {
            e.preventDefault();
            const cuotas = parseInt(document.getElementById('cuotas').value);
            const entrada = parseInt(document.getElementById('entrada').value);
            
            if (!cuotas) {
                Swal.fire('Error', 'Seleccione un plazo de financiación', 'error');
                return;
            }

            const tasas = await FordAPI.obtenerTasasFinanciacion();
            let tasa;
            
            switch(cuotas) {
                case 12: tasa = tasas.tasa12; break;
                case 24: tasa = tasas.tasa24; break;
                case 36: tasa = tasas.tasa36; break;
                case 48: tasa = tasas.tasa48; break;
            }

            const montoFinanciar = producto.precio * (1 - entrada/100);
            const totalIntereses = montoFinanciar * tasa;
            const totalPagar = montoFinanciar + totalIntereses;
            const cuotaMensual = totalPagar / cuotas;
            
            document.getElementById('resultado-financiacion').innerHTML = `
                <h3>Resultado de la simulación</h3>
                <div class="resultado-grid">
                    <div class="resultado-item">
                        <span class="resultado-label">Valor del vehículo:</span>
                        <span class="resultado-valor">$${producto.precio.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="resultado-item">
                        <span class="resultado-label">Entrada (${entrada}%):</span>
                        <span class="resultado-valor">$${(producto.precio * entrada/100).toLocaleString('es-AR')}</span>
                    </div>
                    <div class="resultado-item">
                        <span class="resultado-label">Monto a financiar:</span>
                        <span class="resultado-valor">$${montoFinanciar.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="resultado-item">
                        <span class="resultado-label">Intereses (${(tasa*100).toFixed(0)}%):</span>
                        <span class="resultado-valor">$${totalIntereses.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="resultado-item destacado">
                        <span class="resultado-label">Total a pagar:</span>
                        <span class="resultado-valor">$${totalPagar.toLocaleString('es-AR')}</span>
                    </div>
                    <div class="resultado-item destacado">
                        <span class="resultado-label">Cuota mensual (${cuotas} meses):</span>
                        <span class="resultado-valor">$${cuotaMensual.toLocaleString('es-AR')}</span>
                    </div>
                </div>
            `;
        });
    }

    agregarEventosProductos() {
        // Eventos para agregar al carrito
        document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                const producto = this.productos.find(p => p.id == id);
                
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

        // Eventos para ver detalles
        document.querySelectorAll('.btn-detalles').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.mostrarDetalleProducto(id);
            });
        });
    }

    getColorHex(color) {
        const colores = {
            "Blanco": "#ffffff",
            "Negro": "#000000",
            "Rojo": "#ff0000",
            "Azul": "#0000ff",
            "Gris": "#808080"
        };
        return colores[color] || "#cccccc";
    }
}

const Productos = new ProductosComponent();