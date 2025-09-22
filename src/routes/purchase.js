const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

// POST /purchase - Procesar una nueva compra
router.post('/', PurchaseController.processPurchase);

// GET /purchase - Obtener todas las compras (útil para testing)
router.get('/', PurchaseController.getAllPurchases);

// GET /purchase/client/:clientId - Obtener compras de un cliente específico
router.get('/client/:clientId', PurchaseController.getClientPurchases);

module.exports = router;