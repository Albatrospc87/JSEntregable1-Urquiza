class FordAPI {
    static async obtenerProductos() {
        try {
            const response = await fetch('../data/productos.json');
            if (!response.ok) {
                throw new Error('No se pudieron cargar los productos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar productos:', error);
            // Podríamos cargar datos por defecto aquí si falla la carga
            return {
                vehiculos: [],
                categorias: []
            };
        }
    }

    static async simularCompra(datosCompra) {
        // Simulamos una API de compra con un retraso
        return new Promise((resolve) => {
            setTimeout(() => {
                const exito = Math.random() > 0.1; // 90% de éxito
                if (exito) {
                    resolve({
                        success: true,
                        orderId: `FORD-${Math.floor(Math.random() * 1000000)}`,
                        fecha: new Date().toISOString(),
                        total: datosCompra.total
                    });
                } else {
                    resolve({
                        success: false,
                        error: "Error al procesar el pago"
                    });
                }
            }, 1500);
        });
    }

    static async obtenerTasasFinanciacion() {
        // Simulamos tasas de financiación desde una API
        return {
            tasa12: 0.25,
            tasa24: 0.30,
            tasa36: 0.35,
            tasa48: 0.40
        };
    }
}