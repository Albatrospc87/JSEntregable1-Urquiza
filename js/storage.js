// Funciones para manejar el almacenamiento local
function guardarDatos(key, datos) {
    try {
        localStorage.setItem(key, JSON.stringify(datos));
        return true;
    } catch (e) {
        console.error("Error al guardar en localStorage:", e);
        return false;
    }
}

function cargarDatos(key) {
    try {
        const datos = localStorage.getItem(key);
        return datos ? JSON.parse(datos) : null;
    } catch (e) {
        console.error("Error al cargar de localStorage:", e);
        return null;
    }
}

function limpiarDatos(key) {
    localStorage.removeItem(key);
    
}