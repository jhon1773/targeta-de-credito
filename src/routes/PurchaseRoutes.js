const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

// Procesar una compra
router.post('/', PurchaseController.processPurchase);

// Obtener todas las compras
router.get('/', PurchaseController.getAllPurchases);

// Obtener compras por ID de cliente
router.get('//client/:clientId', PurchaseController.getPurchasesByClientId);

// GET todas las compras
router.get('/', (req, res) => {
  res.json([]);
});

// POST para agregar compra (opcional)
router.post('/', (req, res) => {
  const newPurchase = { id: purchases.length + 1, ...req.body };
  purchases.push(newPurchase);
  res.status(201).json(newPurchase);
});

module.exports = router;