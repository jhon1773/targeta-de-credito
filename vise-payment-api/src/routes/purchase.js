const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');

const router = express.Router();

// Route to process a purchase
router.post('/', PurchaseController.processPurchase);

// Route to get all purchases
router.get('/', PurchaseController.getAllPurchases);

// Route to get purchases by client ID
router.get('/client/:clientId', PurchaseController.getPurchasesByClientId);

module.exports = router;