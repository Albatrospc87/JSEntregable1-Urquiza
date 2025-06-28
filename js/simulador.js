// Base de datos de vehículos
const vehiculos = [
    { id: 1, modelo: "Ford Fiesta", precio: 25000000, año: 2025 },
    { id: 2, modelo: "Ford Focus", precio: 18000000, año: 2020 },
    { id: 3, modelo: "Ford Ranger", precio: 35000000, año: 2025 },
    { id: 4, modelo: "Ford Bronco", precio: 45000000, año: 2025 }
];

// Carrito de compras y financiación
let carrito = [];
let financiacion = 0;

// Funciones del simulador
function mostrarCatalogo() {
    return vehiculos.map(auto => ({
        id: auto.id,
        texto: `${auto.modelo} - $${auto.precio.toLocaleString()} - Año ${auto.año}`
    }));
}

function agregarAlCarrito(idVehiculo) {
    const vehiculo = vehiculos.find(v => v.id === parseInt(idVehiculo));

    if (vehiculo) {
        carrito.push(vehiculo);
        guardarCarrito();
        return { success: true, vehiculo };
    }
    return { success: false };
}

function simularFinanciacion(meses) {
    const mesesValidos = [12, 24, 36, 48];

    if (!mesesValidos.includes(parseInt(meses))) {
        return { error: "Plazo no válido. Use 12, 24, 36 o 48 meses" };
    }

    const total = carrito.reduce((sum, auto) => sum + auto.precio, 0);
    const interes = meses * 0.02; // 2% por mes
    financiacion = total * (1 + interes);
    const cuota = financiacion / meses;

    return {
        total: financiacion,
        cuota: cuota,
        meses: meses,
        resumen: `Financiación a ${meses} meses:\nTotal: $${financiacion.toFixed(2)}\nCuota mensual: $${cuota.toFixed(2)}`
    };
}

function obtenerResumenCarrito() {
    if (carrito.length === 0) {
        return { vacio: true };
    }

    const items = carrito.map(auto => ({
        modelo: auto.modelo,
        precio: auto.precio
    }));

    const total = carrito.reduce((sum, auto) => sum + auto.precio, 0);

    return {
        items,
        total,
        financiacion,
        vacio: false
    };
}

function finalizarCompra() {
    if (carrito.length === 0) {
        return { success: false, message: "No hay vehículos en el carrito" };
    }

    const venta = {
        fecha: new Date().toISOString(),
        items: carrito,
        total: carrito.reduce((sum, auto) => sum + auto.precio, 0),
        financiacion: financiacion
    };

    // Limpiar carrito
    carrito = [];
    financiacion = 0;
    guardarCarrito();

    return { success: true, venta };
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoFord');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

function guardarCarrito() {
    localStorage.setItem('carritoFord', JSON.stringify(carrito));
}

// Inicialización
cargarCarrito();