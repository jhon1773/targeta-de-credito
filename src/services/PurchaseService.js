const Purchase = require("../models/Purchase");
const CardBenefitsService = require("./CardBenefitsService");

// Very small in-memory purchase service used by the controller
class PurchaseService {
  constructor() {
    this.purchases = [];
  }

  /**
   * @swagger
   * /purchase:
   *   post:
   *     summary: Procesa una compra con tarjeta
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               clientId:
   *                 type: string
   *               cardType:
   *                 type: string
   *               amount:
   *                 type: number
   *               day:
   *                 type: integer
   *               isInternational:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Compra procesada exitosamente
   *       400:
   *         description: Error en los datos de la compra
   */
  async processPurchase(purchaseData) {
    // Mejora: validar entradas y normalizar tipos
    if (!purchaseData || typeof purchaseData !== "object") {
      throw new TypeError("purchaseData es requerido y debe ser un objeto");
    }

    const { clientId, cardType } = purchaseData;
    let { amount, day, isInternational } = purchaseData;

    if (!clientId) throw new TypeError("clientId es requerido");
    if (!cardType) throw new TypeError("cardType es requerido");

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      throw new TypeError("amount debe ser un número positivo");
    }

    const parsedDay =
      day === undefined || day === null ? undefined : Number(day);
    if (
      parsedDay !== undefined &&
      (!Number.isInteger(parsedDay) || parsedDay < 1 || parsedDay > 31)
    ) {
      throw new TypeError("day debe ser un entero entre 1 y 31 cuando se proporciona");
    }

    const isIntl = Boolean(isInternational);

    let discount = 0;
    try {
      // Mantener compatibilidad si calculateDiscount es síncrono
      discount = CardBenefitsService.calculateDiscount(
        cardType,
        numAmount,
        parsedDay,
        isIntl
      );
    } catch (err) {
      throw new Error("Error al calcular el descuento: " + err.message);
    }

    discount = Number(discount) || 0;
    // Proteger contra descuentos negativos o mayores al monto
    if (discount < 0) discount = 0;
    if (discount > numAmount) discount = numAmount;

    const finalAmount = Number((numAmount - discount).toFixed(2));

    // Generar id simple y timestamp en metadata para trazabilidad
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const createdAt = new Date().toISOString();

    const purchase = new Purchase(clientId, numAmount, discount, finalAmount, {
      id,
      createdAt,
      cardType,
      day: parsedDay,
      isInternational: isIntl,
    });

    this.purchases.push(purchase);
    return purchase;
  }

  /**
   * @swagger
   * /purchase:
   *   get:
   *     summary: Obtiene todas las compras
   *     responses:
   *       200:
   *         description: Lista de compras
   */
  async getAllPurchases() {
    return this.purchases;
  }

  /**
   * @swagger
   * /purchase/client/{clientId}:
   *   get:
   *     summary: Obtiene las compras de un cliente específico
   *     parameters:
   *       - in: path
   *         name: clientId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Lista de compras del cliente
   *       404:
   *         description: Cliente no encontrado
   */
  async getPurchasesByClient(clientId) {
    if (clientId === undefined || clientId === null) return [];
    return this.purchases.filter((p) => String(p.clientId) === String(clientId));
  }
}

module.exports = new PurchaseService();
