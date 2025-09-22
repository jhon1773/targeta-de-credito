const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar rutas
const clientRoutes = require('./src/routes/client');
const purchaseRoutes = require('./src/routes/purchase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y configuración
app.use(helmet()); // Seguridad básica
app.use(cors()); // Permitir CORS
app.use(express.json({ limit: '10mb' })); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Middleware para logging de requests
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
    res.status(500).json({
        status: 'Error',
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, '127.0.0.1', () => {
    console.log('=================================');
    console.log('🚀 VISE Payment API');
    console.log('=================================');
    console.log(`📍 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🌐 URL: http://127.0.0.1:${PORT}`);
    console.log(`📊 Estado: http://127.0.0.1:${PORT}/health`);
    console.log('=================================');
    console.log('📝 Endpoints disponibles:');
    console.log('   POST /client - Registrar cliente');
    console.log('   POST /purchase - Procesar compra');
    console.log('   GET /health - Estado de la API');
    console.log('=================================');
}).on('error', (err) => {
    console.error('❌ Error al iniciar el servidor:', err.message);
    console.error('💡 Asegúrate de que el puerto 3000 no esté en uso por otra aplicación');
});

module.exports = app;