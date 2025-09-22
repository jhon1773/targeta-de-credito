const http = require('http');

// Función para hacer requests
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Función para mostrar resultados
function showResult(description, result) {
    console.log(`\n=== ${description} ===`);
    console.log(`Status: ${result.status}`);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

// Ejecutar pruebas
async function runTests() {
    console.log('🚀 INICIANDO PRUEBAS DE LA API VISE PAYMENT\n');

    try {
        // 1. Verificar estado de la API
        const health = await makeRequest('GET', '/health');
        showResult('Estado de la API', health);

        // 2. Registrar cliente Classic
        const client1 = await makeRequest('POST', '/client', {
            name: "Ana López",
            country: "Colombia",
            monthlyIncome: 300,
            viseClub: false,
            cardType: "Classic"
        });
        showResult('Cliente Classic', client1);

        // 3. Registrar cliente Gold
        const client2 = await makeRequest('POST', '/client', {
            name: "Carlos Mendoza",
            country: "Argentina",
            monthlyIncome: 750,
            viseClub: false,
            cardType: "Gold"
        });
        showResult('Cliente Gold', client2);

        // 4. Registrar cliente Platinum
        const client3 = await makeRequest('POST', '/client', {
            name: "Laura Silva",
            country: "Brasil",
            monthlyIncome: 1500,
            viseClub: true,
            cardType: "Platinum"
        });
        showResult('Cliente Platinum', client3);

        // 5. Intentar cliente con restricciones no cumplidas
        const client4 = await makeRequest('POST', '/client', {
            name: "Pedro González",
            country: "España",
            monthlyIncome: 400,
            viseClub: false,
            cardType: "Gold"
        });
        showResult('Cliente Gold con ingreso insuficiente (debe fallar)', client4);

        // 6. Compra Classic (sin beneficios)
        const purchase1 = await makeRequest('POST', '/purchase', {
            clientId: 1,
            amount: 100,
            currency: "USD",
            purchaseDate: "2025-09-22T10:00:00Z",
            purchaseCountry: "Colombia"
        });
        showResult('Compra Classic (sin beneficios)', purchase1);

        // 7. Compra Gold con descuento (lunes)
        const purchase2 = await makeRequest('POST', '/purchase', {
            clientId: 2,
            amount: 120,
            currency: "USD",
            purchaseDate: "2025-09-22T10:00:00Z", // Lunes
            purchaseCountry: "Argentina"
        });
        showResult('Compra Gold con descuento 15% (lunes)', purchase2);

        // 8. Compra Platinum con descuento sábado + internacional
        const purchase3 = await makeRequest('POST', '/purchase', {
            clientId: 3,
            amount: 250,
            currency: "USD",
            purchaseDate: "2025-09-20T14:30:00Z", // Sábado
            purchaseCountry: "France"
        });
        showResult('Compra Platinum sábado + internacional', purchase3);

        // 9. Ver todos los clientes
        const allClients = await makeRequest('GET', '/client');
        showResult('Todos los clientes', allClients);

        // 10. Ver todas las compras
        const allPurchases = await makeRequest('GET', '/purchase');
        showResult('Todas las compras', allPurchases);

        console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
    }
}

// Ejecutar las pruebas
runTests();