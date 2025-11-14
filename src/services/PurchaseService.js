const Purchase = require("../models/Purchase");
const CardBenefitsService = require("./CardBenefitsService");
const ClientService = require("./ClientService");

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

    const { clientId, purchaseDate, purchaseCountry } = purchaseData;
    let { amount } = purchaseData;

    if (!clientId) throw new TypeError("clientId es requerido");

    // Buscar el cliente para obtener su cardType
    const client = await ClientService.getById(clientId);
    if (!client) {
      throw new Error(`Cliente con ID ${clientId} no encontrado`);
    }

    const cardType = client.cardType;
    if (!cardType) throw new TypeError("El cliente no tiene un tipo de tarjeta asignado");

    // Verificar restricciones por país para tarjetas Black
    if (cardType === 'Black' && purchaseCountry) {
      const restrictedCountries = ['China', 'Vietnam', 'India', 'Iran'];
      if (restrictedCountries.includes(purchaseCountry)) {
        throw new Error(`El cliente con tarjeta ${cardType} no puede realizar compras desde ${purchaseCountry}`);
      }
    }

    // Determinar si es compra internacional
    const clientCountry = client.country || '';
    const buyCountry = purchaseCountry || '';
    const isInternational = buyCountry && buyCountry.toLowerCase() !== clientCountry.toLowerCase();
    
    // Determinar el día de la semana si se proporciona purchaseDate
    let dayName;
    if (purchaseDate) {
      const date = new Date(purchaseDate);
      const dayNumber = date.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dayName = dayNames[dayNumber];
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      throw new TypeError("amount debe ser un número positivo");
    }

    let discount = 0;
    try {
      // Mantener compatibilidad si calculateDiscount es síncrono
      discount = CardBenefitsService.calculateDiscount(
        cardType,
        numAmount,
        dayName,
        isInternational
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
      day: dayName,
      isInternational: isInternational,
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
