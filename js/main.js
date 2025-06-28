// Configurar event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Asignar eventos a los botones del menú
    elementos.btnCatalogo.addEventListener('click', mostrarCatalogoEnDOM);
    elementos.btnCotizar.addEventListener('click', mostrarFormularioCotizar);
    elementos.btnFinanciacion.addEventListener('click', mostrarFormularioFinanciacion);
    elementos.btnCarrito.addEventListener('click', mostrarCarritoEnDOM);
    elementos.btnFinalizar.addEventListener('click', mostrarConfirmacionCompra);

    // Mostrar mensaje de bienvenida
    mostrarMensaje("Bienvenido a Concesionaria Ford. Explore nuestros vehículos y opciones de financiación");
});