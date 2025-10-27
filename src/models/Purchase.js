class Purchase {
    constructor(clientId, originalAmount, discountApplied, finalAmount, benefit) {
        this.clientId = clientId;
        this.originalAmount = originalAmount;
        this.discountApplied = discountApplied;
        this.finalAmount = finalAmount;
        this.benefit = benefit;
        this.purchaseDate = new Date();
    }
}

module.exports = Purchase;