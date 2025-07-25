class CarritoComponent {
    static carrito = [];

    static inicializar() {
        this.cargarCarrito();
        this.actualizarContador();
    }

    static cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoFord');
        this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    static guardarCarrito() {
        localStorage.setItem('carritoFord', JSON.stringify(this.carrito));
        this.actualizarContador();
    }

    static agregarProducto(producto) {
        const itemExistente = this.carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
    }

    static eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.mostrarCarrito();
    }

    static vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.mostrarCarrito();
    }

    static actualizarCantidad(id, nuevaCantidad) {
        const item = this.carrito.find(item => item.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.mostrarCarrito();
        }
    }

    static actualizarContador() {
        const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        document.getElementById('carrito-contador').textContent = totalItems;
    }

    static mostrarCarrito() {
        const modal = document.getElementById('modal-carrito');
        const contenido = document.getElementById('carrito-contenido');
        
        if (this.carrito.length === 0) {
            contenido.innerHTML = '<p class="mensaje">Tu carrito está vacío</p>';
            return;
        }

        let html = `
            <div class="carrito-items">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            html += `
                <tr>
                    <td>${item.modelo}</td>
                    <td>$${item.precio.toLocaleString('es-AR')}</td>
                    <td>
                        <input type="number" min="1" max="${item.stock}" 
                               value="${item.cantidad}" 
                               data-id="${item.id}" 
                               class="input-cantidad">
                    </td>
                    <td>$${subtotal.toLocaleString('es-AR')}</td>
                    <td>
                        <button class="btn-eliminar" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        const total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        html += `
                    </tbody>
                </table>
                <div class="carrito-total">
                    <span>Total:</span>
                    <span>$${total.toLocaleString('es-AR')}</span>
                </div>
            </div>
        `;

        contenido.innerHTML = html;

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('button').dataset.id);
                this.eliminarProducto(id);
            });
        });

        // Agregar eventos a los inputs de cantidad
        document.querySelectorAll('.input-cantidad').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const nuevaCantidad = parseInt(e.target.value);
                
                if (nuevaCantidad > 0) {
                    this.actualizarCantidad(id, nuevaCantidad);
                } else {
                    e.target.value = 1;
                }
            });
        });

        // Mostrar el modal
        modal.style.display = 'block';
    }

    static async finalizarCompra() {
        if (this.carrito.length === 0) {
            Swal.fire('Error', 'Tu carrito está vacío', 'error');
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Finalizar Compra',
            html: `
                <div class="form-compra">
                    <input id="nombre" class="swal2-input" placeholder="Nombre completo" required>
                    <input id="email" class="swal2-input" placeholder="Email" type="email" required>
                    <input id="telefono" class="swal2-input" placeholder="Teléfono" required>
                    <select id="metodo-pago" class="swal2-input" required>
                        <option value="">Método de pago</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta de crédito</option>
                        <option value="financiacion">Financiación Ford</option>
                    </select>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Confirmar Compra',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return {
                    nombre: document.getElementById('nombre').value,
                    email: document.getElementById('email').value,
                    telefono: document.getElementById('telefono').value,
                    metodoPago: document.getElementById('metodo-pago').value
                };
            }
        });

        if (!formValues) return;

        // Validar datos del formulario
        if (!formValues.nombre || !formValues.email || !formValues.metodoPago) {
            Swal.fire('Error', 'Por favor complete todos los campos', 'error');
            return;
        }

        // Mostrar loading
        Swal.fire({
            title: 'Procesando compra...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simular envío a la API
        const total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const respuesta = await FordAPI.simularCompra({
            ...formValues,
            productos: this.carrito,
            total: total
        });

        Swal.close();

        if (respuesta.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Compra exitosa!',
                html: `
                    <p>Número de orden: <strong>${respuesta.orderId}</strong></p>
                    <p>Total: <strong>$${total.toLocaleString('es-AR')}</strong></p>
                    <p>Un asesor se contactará contigo a la brevedad.</p>
                `,
                confirmButtonText: 'Aceptar'
            });
            
            // Vaciar carrito después de compra exitosa
            this.vaciarCarrito();
            document.getElementById('modal-carrito').style.display = 'none';
        } else {
            Swal.fire('Error', respuesta.error || 'Ocurrió un error al procesar tu compra', 'error');
        }
    }
}