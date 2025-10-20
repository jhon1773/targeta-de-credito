const Purchase = require('../models/Purchase');

class CardBenefitsService {
    
    /**
     * Calcula los beneficios aplicables a una compra según el tipo de tarjeta
     * @param {Purchase} purchase - Objeto de compra
     * @param {Object} client - Datos del cliente
     * @returns {Object} - Resultado con descuentos aplicados
     */
    static calculateBenefits(purchase, client) {
        const cardType = client.cardType;
        
        switch (cardType) {
            case 'Classic':
                return this.calculateClassicBenefits(purchase, client);
            case 'Gold':
                return this.calculateGoldBenefits(purchase, client);
            case 'Platinum':
                return this.calculatePlatinumBenefits(purchase, client);
            case 'Black':
                return this.calculateBlackBenefits(purchase, client);
            case 'White':
                return this.calculateWhiteBenefits(purchase, client);
            default:
                return { error: 'Tipo de tarjeta no válido' };
        }
    }

    /**
     * Classic: No tiene beneficios
     */
    static calculateClassicBenefits(purchase, client) {
        return {
            originalAmount: purchase.originalAmount,
            discountApplied: 0,
            finalAmount: purchase.originalAmount,
            benefit: null
        };
    }

    /**
     * Gold: Los lunes, martes y miércoles, las compras mayores a 100 USD poseen un 15% de descuento
     */
    static calculateGoldBenefits(purchase, client) {
        const result = {
            originalAmount: purchase.originalAmount,
            discountApplied: 0,
            finalAmount: purchase.originalAmount,
            benefit: null
        };
        
        // Verificar descuento de lunes a miércoles
        if (purchase.isMondayToWednesday() && purchase.originalAmount > 100) {
            const discount = purchase.originalAmount * 0.15;
            result.discountApplied = discount;
            result.finalAmount = purchase.originalAmount - discount;
            result.benefit = `${purchase.getDayOfWeek().name} - Descuento 15%`;
        }

        return result;
    }

    /**
     * Platinum: 
     * - Los lunes, martes y miércoles, las compras mayores a 100 USD poseen un 20% de descuento
     * - Los sábados, las compras mayores a 200 USD poseen un 30% de descuento
     * - Las compras realizadas en el exterior poseen un 5% de descuento
     * NOTA: Los descuentos no se acumulan, se aplica el mejor descuento disponible
     */
    static calculatePlatinumBenefits(purchase, client) {
        const result = {
            originalAmount: purchase.originalAmount,
            discountApplied: 0,
            finalAmount: purchase.originalAmount,
            benefit: null
        };

        let bestDiscount = 0;
        let bestBenefit = null;

        // Descuento de lunes a miércoles (20%)
        if (purchase.isMondayToWednesday() && purchase.originalAmount > 100) {
            const weekdayDiscount = purchase.originalAmount * 0.20;
            if (weekdayDiscount > bestDiscount) {
                bestDiscount = weekdayDiscount;
                bestBenefit = `${purchase.getDayOfWeek().name} - Descuento 20%`;
            }
        }
        
        // Descuento de sábado (30%) - prioridad mayor
        if (purchase.isSaturday() && purchase.originalAmount > 200) {
            const saturdayDiscount = purchase.originalAmount * 0.30;
            if (saturdayDiscount > bestDiscount) {
                bestDiscount = saturdayDiscount;
                bestBenefit = 'Sábado - Descuento 30%';
            }
        }

        // Descuento por compra internacional (5%) - se aplica ADEMÁS del mejor descuento
        let internationalDiscount = 0;
        if (purchase.isInternationalPurchase(client.country)) {
            internationalDiscount = purchase.originalAmount * 0.05;
        }

        // Aplicar descuentos
        if (bestDiscount > 0 || internationalDiscount > 0) {
            result.discountApplied = bestDiscount + internationalDiscount;
            result.finalAmount = purchase.originalAmount - result.discountApplied;
            
            // Construir mensaje de beneficio
            if (bestBenefit && internationalDiscount > 0) {
                result.benefit = `${bestBenefit} + Compra internacional - Descuento 5%`;
            } else if (bestBenefit) {
                result.benefit = bestBenefit;
            } else if (internationalDiscount > 0) {
                result.benefit = 'Compra internacional - Descuento 5%';
            }
        }

        return result;
    }

    /**
     * Black:
     * - Los lunes, martes y miércoles, las compras mayores a 100 USD poseen un 25% de descuento
     * - Los sábados, las compras mayores a 200 USD poseen un 35% de descuento
     * - Las compras realizadas en el exterior poseen un 5% de descuento
     * NOTA: Los descuentos no se acumulan, se aplica el mejor descuento disponible
     */
    static calculateBlackBenefits(purchase, client) {
        const result = {
            originalAmount: purchase.originalAmount,
            discountApplied: 0,
            finalAmount: purchase.originalAmount,
            benefit: null
        };

        let bestDiscount = 0;
        let bestBenefit = null;

        // Descuento de lunes a miércoles (25%)
        if (purchase.isMondayToWednesday() && purchase.originalAmount > 100) {
            const weekdayDiscount = purchase.originalAmount * 0.25;
            if (weekdayDiscount > bestDiscount) {
                bestDiscount = weekdayDiscount;
                bestBenefit = `${purchase.getDayOfWeek().name} - Descuento 25%`;
            }
        }
        
        // Descuento de sábado (35%) - prioridad mayor
        if (purchase.isSaturday() && purchase.originalAmount > 200) {
            const saturdayDiscount = purchase.originalAmount * 0.35;
            if (saturdayDiscount > bestDiscount) {
                bestDiscount = saturdayDiscount;
                bestBenefit = 'Sábado - Descuento 35%';
            }
        }

        // Descuento por compra internacional (5%) - se aplica ADEMÁS del mejor descuento
        let internationalDiscount = 0;
        if (purchase.isInternationalPurchase(client.country)) {
            internationalDiscount = purchase.originalAmount * 0.05;
        }

        // Aplicar descuentos
        if (bestDiscount > 0 || internationalDiscount > 0) {
            result.discountApplied = bestDiscount + internationalDiscount;
            result.finalAmount = purchase.originalAmount - result.discountApplied;
            
            // Construir mensaje de beneficio
            if (bestBenefit && internationalDiscount > 0) {
                result.benefit = `${bestBenefit} + Compra internacional - Descuento 5%`;
            } else if (bestBenefit) {
                result.benefit = bestBenefit;
            } else if (internationalDiscount > 0) {
                result.benefit = 'Compra internacional - Descuento 5%';
            }
        }

        return result;
    }

    /**
     * White:
     * - Del lunes a viernes, las compras mayores a 100 USD poseen un 25% de descuento
     * - Los sábados y domingos, las compras mayores a 200 USD poseen un 35% de descuento
     * - Las compras realizadas en el exterior poseen un 5% de descuento
     * NOTA: Los descuentos no se acumulan, se aplica el mejor descuento disponible
     */
    static calculateWhiteBenefits(purchase, client) {
        const result = {
            originalAmount: purchase.originalAmount,
            discountApplied: 0,
            finalAmount: purchase.originalAmount,
            benefit: null
        };

        let bestDiscount = 0;
        let bestBenefit = null;

        // Descuento de lunes a viernes (25%)
        if (purchase.isWeekday() && purchase.originalAmount > 100) {
            const weekdayDiscount = purchase.originalAmount * 0.25;
            if (weekdayDiscount > bestDiscount) {
                bestDiscount = weekdayDiscount;
                bestBenefit = `${purchase.getDayOfWeek().name} - Descuento 25%`;
            }
        }
        
        // Descuento de fin de semana (35%) - prioridad mayor
        if (purchase.isWeekend() && purchase.originalAmount > 200) {
            const weekendDiscount = purchase.originalAmount * 0.35;
            if (weekendDiscount > bestDiscount) {
                bestDiscount = weekendDiscount;
                bestBenefit = `${purchase.getDayOfWeek().name} - Descuento 35%`;
            }
        }

        // Descuento por compra internacional (5%) - se aplica ADEMÁS del mejor descuento
        let internationalDiscount = 0;
        if (purchase.isInternationalPurchase(client.country)) {
            internationalDiscount = purchase.originalAmount * 0.05;
        }

        // Aplicar descuentos
        if (bestDiscount > 0 || internationalDiscount > 0) {
            result.discountApplied = bestDiscount + internationalDiscount;
            result.finalAmount = purchase.originalAmount - result.discountApplied;
            
            // Construir mensaje de beneficio
            if (bestBenefit && internationalDiscount > 0) {
                result.benefit = `${bestBenefit} + Compra internacional - Descuento 5%`;
            } else if (bestBenefit) {
                result.benefit = bestBenefit;
            } else if (internationalDiscount > 0) {
                result.benefit = 'Compra internacional - Descuento 5%';
            }
        }

        return result;
    }

    /**
     * Valida si un cliente puede realizar una compra según las restricciones de su tarjeta
     * @param {Object} client - Datos del cliente
     * @param {Purchase} purchase - Datos de la compra
     * @returns {Object} - Resultado de la validación
     */
    static validatePurchaseRestrictions(client, purchase) {
        const cardType = client.cardType;
        
        // Para tarjetas Black y White, verificar restricciones de país
        if (cardType === 'Black' || cardType === 'White') {
            const restrictedCountries = ['China', 'Vietnam', 'India', 'Irán'];
            if (restrictedCountries.includes(purchase.purchaseCountry)) {
                return {
                    isValid: false,
                    error: `El cliente con tarjeta ${cardType} no puede realizar compras desde ${purchase.purchaseCountry}`
                };
            }
        }

        return { isValid: true };
    }
}

module.exports = CardBenefitsService;
