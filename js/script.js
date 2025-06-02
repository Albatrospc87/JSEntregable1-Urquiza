// Base de datos de vehículos
const vehiculos = [
    { id: 1, modelo: "Ford Fiesta", precio: 25000000, año: 2025 },
    { id: 2, modelo: "Ford Focus", precio: 18000000, año: 2020 },
    { id: 3, modelo: "Ford Ranger", precio: 35000000, año: 2025 },
    { id: 4, modelo: "Ford Bronco", precio: 45000000, año: 2025 }
];

// Carrito de compras
let carrito = [];
let financiacion = 0;

// Función principal
function iniciarSimulador() {
    alert("Bienvenido a Concesionaria Ford\n\nExplora nuestros vehículos y opciones de financiación");
    
    while(true) {
        const opcion = prompt(
            "Menú Principal:\n\n" +
            "1. Ver catálogo de vehículos\n" +
            "2. Cotizar vehículo\n" +
            "3. Simular financiación\n" +
            "4. Ver carrito\n" +
            "5. Finalizar compra\n" +
            "6. Salir\n\n" +
            "Ingrese el número de opción:"
        );

        if(opcion === "1") {
            mostrarCatalogo();
        } else if(opcion === "2") {
            agregarAlCarrito();
        } else if(opcion === "3") {
            simularFinanciacion();
        } else if(opcion === "4") {
            verCarrito();
        } else if(opcion === "5") {
            finalizarCompra();
        } else if(opcion === "6") {
            alert("Gracias por visitar Concesionaria Ford");
            break;
        } else {
            alert("Opción no válida");
        }
    }
}

// Mostrar catálogo
function mostrarCatalogo() {
    let catalogo = "CATÁLOGO FORD 2025:\n\n";
    vehiculos.forEach(auto => {
        catalogo += `${auto.id}. ${auto.modelo} - $${auto.precio} - Año ${auto.año}\n`;
    });
    alert(catalogo);
}

// Agregar al carrito
function agregarAlCarrito() {
    mostrarCatalogo();
    const seleccion = prompt("Ingrese el número del vehículo que desea cotizar:");
    const vehiculo = vehiculos.find(v => v.id === parseInt(seleccion));
    
    if(vehiculo) {
        carrito.push(vehiculo);
        alert(`${vehiculo.modelo} agregado a tu carrito`);
    } else {
        alert("Selección inválida");
    }
}

// Simular financiación
function simularFinanciacion() {
    if(carrito.length === 0) {
        alert("Primero agregue vehículos al carrito");
        return;
    }
    
    const meses = prompt("Ingrese cantidad de cuotas (12, 24, 36 o 48 meses):");
    const mesesValidos = [12, 24, 36, 48];
    
    if(!mesesValidos.includes(parseInt(meses))) {
        alert("Plazo no válido. Use 12, 24, 36 o 48 meses");
        return;
    }
    
    const total = carrito.reduce((sum, auto) => sum + auto.precio, 0);
    const interes = meses * 0.02; // 2% por mes
    financiacion = total * (1 + interes);
    const cuota = financiacion / meses;
    
    alert(`Financiación a ${meses} meses:\n\nTotal: $${financiacion.toFixed(2)}\nCuota mensual: $${cuota.toFixed(2)}`);
}

// Ver carrito
function verCarrito() {
    if(carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }
    
    let resumen = "TU CARRITO:\n\n";
    carrito.forEach(auto => {
        resumen += `${auto.modelo} - $${auto.precio}\n`;
    });
    
    const total = carrito.reduce((sum, auto) => sum + auto.precio, 0);
    resumen += `\nTOTAL: $${total}`;
    
    if(financiacion > 0) {
        resumen += `\nFinanciación total: $${financiacion.toFixed(2)}`;
    }
    
    alert(resumen);
}

// Finalizar compra
function finalizarCompra() {
    if(carrito.length === 0) {
        alert("No hay vehículos en el carrito");
        return;
    }
    
    verCarrito();
    const confirmacion = confirm("¿Confirmar compra?");
    
    if(confirmacion) {
        alert("¡Compra realizada con éxito!\n\nUn asesor se contactará con usted");
        carrito = [];
        financiacion = 0;
    }
}

// Iniciar simulador
iniciarSimulador();