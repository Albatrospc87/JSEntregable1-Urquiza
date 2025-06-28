// Elementos del DOM
const elementos = {
    menuPrincipal: document.getElementById('menu-principal'),
    contenidoDinamico: document.getElementById('contenido-dinamico'),
    btnCatalogo: document.getElementById('btn-catalogo'),
    btnCotizar: document.getElementById('btn-cotizar'),
    btnFinanciacion: document.getElementById('btn-financiacion'),
    btnCarrito: document.getElementById('btn-carrito'),
    btnFinalizar: document.getElementById('btn-finalizar')
};

// Funciones para manipular el DOM
function mostrarCatalogoEnDOM() {
    const catalogo = mostrarCatalogo();
    let html = '<h2>Catálogo Ford 2025</h2><ul class="lista-vehiculos">';
    
    catalogo.forEach(auto => {
        html += `<li>${auto.texto}</li>`;
    });
    
    html += '</ul>';
    elementos.contenidoDinamico.innerHTML = html;
}

function mostrarFormularioCotizar() {
    const catalogo = mostrarCatalogo();
    let html = `
        <h2>Cotizar Vehículo</h2>
        <form id="form-cotizar">
            <label for="select-vehiculo">Seleccione un vehículo:</label>
            <select id="select-vehiculo" required>
                <option value="">-- Seleccione --</option>
    `;
    
    catalogo.forEach(auto => {
        html += `<option value="${auto.id}">${auto.texto}</option>`;
    });
    
    html += `
            </select>
            <button type="submit">Agregar al Carrito</button>
        </form>
    `;
    
    elementos.contenidoDinamico.innerHTML = html;
    
    // Manejar el envío del formulario
    document.getElementById('form-cotizar').addEventListener('submit', (e) => {
        e.preventDefault();
        const select = document.getElementById('select-vehiculo');
        const resultado = agregarAlCarrito(select.value);
        
        if(resultado.success) {
            mostrarMensaje(`${resultado.vehiculo.modelo} agregado al carrito`);
        } else {
            mostrarMensaje("Selección inválida", "error");
        }
    });
}

function mostrarFormularioFinanciacion() {
    const resumen = obtenerResumenCarrito();
    
    if(resumen.vacio) {
        mostrarMensaje("Primero agregue vehículos al carrito", "error");
        return;
    }
    
    const html = `
        <h2>Simular Financiación</h2>
        <form id="form-financiacion">
            <label for="select-meses">Seleccione cantidad de cuotas:</label>
            <select id="select-meses" required>
                <option value="">-- Seleccione --</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
                <option value="48">48 meses</option>
            </select>
            <button type="submit">Calcular Financiación</button>
        </form>
        <div id="resultado-financiacion"></div>
    `;
    
    elementos.contenidoDinamico.innerHTML = html;
    
    // Manejar el envío del formulario
    document.getElementById('form-financiacion').addEventListener('submit', (e) => {
        e.preventDefault();
        const select = document.getElementById('select-meses');
        const resultado = simularFinanciacion(select.value);
        
        if(resultado.error) {
            mostrarMensaje(resultado.error, "error");
        } else {
            document.getElementById('resultado-financiacion').innerHTML = `
                <h3>Resultado de la financiación</h3>
                <p>Total financiado: $${resultado.total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p>Cuota mensual: $${resultado.cuota.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p>Plazo: ${resultado.meses} meses</p>
            `;
        }
    });
}

function mostrarCarritoEnDOM() {
    const resumen = obtenerResumenCarrito();
    
    if(resumen.vacio) {
        elementos.contenidoDinamico.innerHTML = '<p class="mensaje">Carrito vacío</p>';
        return;
    }
    
    let html = '<h2>Tu Carrito</h2><ul class="lista-carrito">';
    
    resumen.items.forEach(item => {
        html += `<li>${item.modelo} - $${item.precio.toLocaleString('es-AR')}</li>`;
    });
    
    html += `</ul>
        <p class="total">Total: $${resumen.total.toLocaleString('es-AR')}</p>
    `;
    
    if(resumen.financiacion > 0) {
        html += `<p class="financiacion">Financiación total: $${resumen.financiacion.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>`;
    }
    
    elementos.contenidoDinamico.innerHTML = html;
}

function mostrarConfirmacionCompra() {
    const resumen = obtenerResumenCarrito();
    
    if(resumen.vacio) {
        mostrarMensaje("No hay vehículos en el carrito", "error");
        return;
    }
    
    const html = `
        <h2>Confirmar Compra</h2>
        <div class="resumen-compra">
            <h3>Resumen de tu compra:</h3>
            <ul>
    `;
    
    resumen.items.forEach(item => {
        html += `<li>${item.modelo} - $${item.precio.toLocaleString('es-AR')}</li>`;
    });
    
    html += `
            </ul>
            <p class="total">Total: $${resumen.total.toLocaleString('es-AR')}</p>
            <button id="btn-confirmar-compra">Confirmar Compra</button>
            <button id="btn-cancelar-compra">Cancelar</button>
        </div>
    `;
    
    elementos.contenidoDinamico.innerHTML = html;
    
    // Manejar eventos de los botones
    document.getElementById('btn-confirmar-compra').addEventListener('click', () => {
        const resultado = finalizarCompra();
        if(resultado.success) {
            mostrarMensaje("¡Compra realizada con éxito! Un asesor se contactará con usted", "success");
            mostrarCarritoEnDOM();
        } else {
            mostrarMensaje(resultado.message, "error");
        }
    });
    
    document.getElementById('btn-cancelar-compra').addEventListener('click', () => {
        mostrarCarritoEnDOM();
    });
}

function mostrarMensaje(mensaje, tipo = "info") {
    const divMensaje = document.createElement('div');
    divMensaje.className = `mensaje ${tipo}`;
    divMensaje.textContent = mensaje;
    
    elementos.contenidoDinamico.prepend(divMensaje);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);
}