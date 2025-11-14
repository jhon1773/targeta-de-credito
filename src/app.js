require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar telemetría
const telemetry = require('./services/AxiomTelemetry');
const telemetryMiddleware = require('./middleware/telemetryMiddleware');

// Importar rutas
const clientRoutes = require('./routes/ClientRoutes');
const purchaseRoutes = require('./routes/PurchaseRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y configuración
app.use(helmet()); // Seguridad básica
app.use(cors()); // Permitir CORS
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Middleware de telemetría con Axiom
app.use(telemetryMiddleware);

// Middleware para logging básico en consola
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.use('/client', clientRoutes);
app.use('/purchase', purchaseRoutes);

// Ruta de salud/estado de la API
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'VISE Payment API',
        version: '1.0.0'
    });
});

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de Pagos VISE',
        version: '1.0.0',
        endpoints: {
            'POST /client': 'Registrar un nuevo cliente',
            'GET /client': 'Obtener todos los clientes',
            'GET /client/:id': 'Obtener un cliente por ID',
            'POST /purchase': 'Procesar una compra',
            'GET /purchase': 'Obtener todas las compras',
            'GET /purchase/client/:clientId': 'Obtener compras de un cliente',
            'GET /health': 'Estado de la API'
        },
        documentation: {
            'Card Types': ['Classic', 'Gold', 'Platinum', 'Black', 'White'],
            'Example Client Registration': {
                url: 'POST /client',
                body: {
                    name: 'John Doe',
                    country: 'USA',
                    monthlyIncome: 1200,
                    viseClub: true,
                    cardType: 'Platinum'
                }
            },
            'Example Purchase': {
                url: 'POST /purchase',
                body: {
                    clientId: 1,
                    amount: 250,
                    currency: 'USD',
                    purchaseDate: '2025-09-20T14:30:00Z',
                    purchaseCountry: 'France'
                }
            }
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'Not Found',
        error: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
        availableEndpoints: {
            'POST /client': 'Registrar cliente',
            'POST /purchase': 'Procesar compra',
            'GET /health': 'Estado de la API'
        }
    });
});

// Middleware para manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);

    // Log error to Axiom
    telemetry.logError({
        requestId: req.requestId,
        message: err.message || 'Error interno del servidor',
        stack: err.stack,
        statusCode: err.statusCode || 500,
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        errorType: err.name || 'UnhandledError',
        metadata: {
            headers: req.headers,
            body: req.body
        }
    });

    res.status(err.statusCode || 500).json({
        status: 'Error',
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('=================================');
    console.log('🚀 VISE Payment API');
    console.log('=================================');
    console.log(`📍 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Estado: http://localhost:${PORT}/health`);
    console.log('=================================');
    console.log('📝 Endpoints disponibles:');
    console.log('   POST /client - Registrar cliente');
    console.log('   POST /purchase - Procesar compra');
    console.log('   GET /health - Estado de la API');
    console.log('=================================');

    if (telemetry.isEnabled()) {
        console.log('✅ Telemetría de Axiom activada');
    } else {
        console.log('⚠️  Telemetría de Axiom desactivada (configura AXIOM_TOKEN y AXIOM_DATASET)');
    }
    console.log('=================================');
}).on('error', (err) => {
    console.error('❌ Error al iniciar el servidor:', err.message);
    console.log('💡 Asegúrate de que el puerto 3000 no esté en uso por otra aplicación');
    process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor gracefully...`);

    // Flush pending telemetry events
    if (telemetry.isEnabled()) {
        console.log('Enviando eventos de telemetría pendientes...');
        await telemetry.flush();
    }

    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
        console.error('⚠️  Forzando cierre del servidor');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;