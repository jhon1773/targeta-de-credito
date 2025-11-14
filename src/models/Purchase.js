/**
 * @swagger
 * components:
 *   schemas:
 *     Purchase:
 *       type: object
 *       properties:
 *         clientId:
 *           type: string
 *           description: Identificador del cliente
 *         amount:
 *           type: number
 *           description: Monto original de la compra
 *         discount:
 *           type: number
 *           description: Descuento aplicado
 *         finalAmount:
 *           type: number
 *           description: Monto final tras el descuento
 *         metadata:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             createdAt:
 *               type: string
 *             cardType:
 *               type: string
 *             day:
 *               type: integer
 *             isInternational:
 *               type: boolean
 */
class Purchase {
    constructor(clientId, amount, discount, finalAmount, metadata) {
        this.clientId = clientId;
        this.amount = amount;
        this.discount = discount;
        this.finalAmount = finalAmount;
        this.metadata = metadata;
        this.purchaseDate = new Date();
    }
}

module.exports = Purchase;