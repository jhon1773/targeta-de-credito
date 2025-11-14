const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

// Procesar una compra
router.post('/', PurchaseController.processPurchase);

// Obtener todas las compras
router.get('/', PurchaseController.getAllPurchases);

// Obtener compras por ID de cliente
router.get('/client/:clientId', PurchaseController.getPurchasesByClientId);

module.exports = router;