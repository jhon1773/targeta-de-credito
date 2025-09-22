class Purchase {
    constructor(clientId, amount, currency, purchaseDate, purchaseCountry) {
        this.clientId = clientId;
        this.originalAmount = amount;
        this.currency = currency;
        this.purchaseDate = new Date(purchaseDate);
        this.purchaseCountry = purchaseCountry;
        this.discountApplied = 0;
        this.finalAmount = amount;
        this.benefit = null;
        this.status = 'Pending'; // Pending, Approved, Rejected
    }

    getDayOfWeek() {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return {
            name: days[this.purchaseDate.getDay()],
            number: this.purchaseDate.getDay()
        };
    }

    isWeekday() {
        const day = this.purchaseDate.getDay();
        return day >= 1 && day <= 5; // Lunes a Viernes
    }

    isWeekend() {
        const day = this.purchaseDate.getDay();
        return day === 0 || day === 6; // Sábado y Domingo
    }

    isMondayToWednesday() {
        const day = this.purchaseDate.getDay();
        return day >= 1 && day <= 3; // Lunes, Martes, Miércoles
    }

    isSaturday() {
        return this.purchaseDate.getDay() === 6;
    }

    isSunday() {
        return this.purchaseDate.getDay() === 0;
    }

    isInternationalPurchase(clientCountry) {
        return this.purchaseCountry !== clientCountry;
    }

    applyDiscount(percentage, description) {
        this.discountApplied = this.originalAmount * (percentage / 100);
        this.finalAmount = this.originalAmount - this.discountApplied;
        this.benefit = description;
    }
}

module.exports = Purchase;