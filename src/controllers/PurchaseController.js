const Purchase = require('../models/Purchase');
const ClientController = require('./ClientController');
const CardBenefitsService = require('../services/CardBenefitsService');

// Simulamos una base de datos en memoria para las compras
let purchases = [];
let nextPurchaseId = 1;

class PurchaseController {
    
    /**
     * Procesa una nueva compra
     * POST /purchase
     */
    static processPurchase(req, res) {
        try {
            const { clientId, amount, currency, purchaseDate, purchaseCountry } = req.body;

            // Validar que todos los campos requeridos estén presentes
            if (!clientId || !amount || !currency || !purchaseDate || !purchaseCountry) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'Todos los campos son requeridos: clientId, amount, currency, purchaseDate, purchaseCountry'
                });
            }

            // Validar tipos de datos
            if (typeof clientId !== 'number' || clientId <= 0) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'clientId debe ser un número mayor a 0'
                });
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'amount debe ser un número mayor a 0'
                });
            }

            // Validar que la fecha sea válida y no sea futura
            const parsedDate = new Date(purchaseDate);
            const now = new Date();
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'purchaseDate debe tener un formato de fecha válido (ISO 8601)'
                });
            }
            
            // No permitir fechas futuras
            if (parsedDate > now) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'purchaseDate no puede ser una fecha futura'
                });
            }

            // Validar moneda soportada
            const supportedCurrencies = ['USD', 'EUR', 'COP', 'MXN', 'ARS'];
            if (!supportedCurrencies.includes(currency.toUpperCase())) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: `Moneda no soportada. Monedas disponibles: ${supportedCurrencies.join(', ')}`
                });
            }

            // Buscar el cliente
            const client = ClientController.getClientById(clientId);
            if (!client) {
                return res.status(404).json({
                    status: 'Rejected',
                    error: 'Cliente no encontrado'
                });
            }

            if (client.status !== 'Registered') {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'El cliente no está registrado correctamente'
                });
            }

            // Crear instancia de la compra
            const purchase = new Purchase(clientId, amount, currency, purchaseDate, purchaseCountry);

            // Validar restricciones específicas de la tarjeta
            const restrictionResult = CardBenefitsService.validatePurchaseRestrictions(client, purchase);
            if (!restrictionResult.isValid) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: restrictionResult.error
                });
            }

            // Calcular beneficios aplicables
            const benefitsResult = CardBenefitsService.calculateBenefits(purchase, client);

            if (benefitsResult.error) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: benefitsResult.error
                });
            }

            // Actualizar la compra con los beneficios calculados
            purchase.discountApplied = benefitsResult.discountApplied;
            purchase.finalAmount = benefitsResult.finalAmount;
            purchase.benefit = benefitsResult.benefit;
            purchase.status = 'Approved';

            // Asignar ID y guardar la compra
            purchase.purchaseId = nextPurchaseId++;
            purchases.push(purchase);

            // Preparar respuesta
            const discountPercentage = purchase.originalAmount > 0 ? 
                Math.round((purchase.discountApplied / purchase.originalAmount) * 100 * 100) / 100 : 0;

            const response = {
                status: 'Approved',
                purchase: {
                    purchaseId: purchase.purchaseId,
                    clientId: purchase.clientId,
                    originalAmount: purchase.originalAmount,
                    discountApplied: Math.round(purchase.discountApplied * 100) / 100, // Redondear a 2 decimales
                    discountPercentage: `${discountPercentage}%`,
                    finalAmount: Math.round(purchase.finalAmount * 100) / 100, // Redondear a 2 decimales
                    currency: purchase.currency,
                    benefit: purchase.benefit,
                    purchaseDate: purchase.purchaseDate.toISOString(),
                    purchaseCountry: purchase.purchaseCountry
                }
            };

            return res.status(200).json(response);

        } catch (error) {
            console.error('Error en processPurchase:', error);
            return res.status(500).json({
                status: 'Error',
                error: 'Error interno del servidor'
            });
        }
    }

    /**
     * Obtiene todas las compras (útil para testing)
     */
    static getAllPurchases(req, res) {
        return res.json({
            total: purchases.length,
            purchases: purchases
        });
    }

    /**
     * Obtiene las compras de un cliente específico
     */
    static getClientPurchases(req, res) {
        try {
            const clientId = parseInt(req.params.clientId);
            const clientPurchases = purchases.filter(purchase => purchase.clientId === clientId);

            return res.json({
                clientId: clientId,
                total: clientPurchases.length,
                purchases: clientPurchases
            });

        } catch (error) {
            console.error('Error en getClientPurchases:', error);
            return res.status(500).json({
                status: 'Error',
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = PurchaseController;