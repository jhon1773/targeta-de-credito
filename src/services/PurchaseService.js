const Purchase = require('../models/Purchase');
const CardBenefitsService = require('./CardBenefitsService');

// Very small in-memory purchase service used by the controller
class PurchaseService {
    constructor() {
        this.purchases = [];
    }

    async processPurchase(purchaseData) {
        // purchaseData should contain: clientId, cardType, amount, day, isInternational
        const { clientId, cardType, amount, day, isInternational } = purchaseData;
        const discount = CardBenefitsService.calculateDiscount(cardType, amount, day, isInternational);
        const finalAmount = amount - discount;
        const purchase = new Purchase(clientId, amount, discount, finalAmount, { cardType, day, isInternational });
        this.purchases.push(purchase);
        return purchase;
    }

    async getAllPurchases() {
        return this.purchases;
    }

    async getPurchasesByClient(clientId) {
        return this.purchases.filter(p => String(p.clientId) === String(clientId));
    }
}

module.exports = new PurchaseService();
