document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar componentes
    await Productos.inicializar();
    CarritoComponent.inicializar();
    UIComponent.inicializar();
    
    // Mostrar página de inicio por defecto
    UIComponent.mostrarInicio();
});