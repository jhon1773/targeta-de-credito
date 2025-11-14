/**
 * @swagger
 * /purchase:
 *   post:
 *     summary: Procesa una compra con tarjeta
 *     tags:
 *       - Purchase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Purchase'
 *     responses:
 *       200:
 *         description: Compra procesada exitosamente
 *       400:
 *         description: Error en los datos de la compra
 *   get:
 *     summary: Obtiene todas las compras
 *     tags:
 *       - Purchase
 *     responses:
 *       200:
 *         description: Lista de compras
 *
 * /purchase/client/{clientId}:
 *   get:
 *     summary: Obtiene las compras de un cliente específico
 *     tags:
 *       - Purchase
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

const telemetry = require('../services/AxiomTelemetry');

class PurchaseController {
  constructor(purchaseService) {
    this.purchaseService = purchaseService;
  }

  async processPurchase(req, res, next) {
    try {
      const purchaseData = req.body;
      const result = await this.purchaseService.processPurchase(purchaseData);

      // Log detailed business event for purchase
      telemetry.logBusinessEvent({
        requestId: req.requestId,
        eventName: 'purchase_processed',
        eventType: 'purchase',
        details: {
          purchaseId: result.metadata?.id,
          clientId: purchaseData.clientId,
          amount: purchaseData.amount,
          discount: result.discount,
          finalAmount: result.finalAmount,
          cardType: result.metadata?.cardType,
          dayOfWeek: result.metadata?.day,
          isInternational: result.metadata?.isInternational,
          status: result.status,
          discountPercentage: result.discount ? ((result.discount / purchaseData.amount) * 100).toFixed(2) : 0
        }
      });

      res.status(200).json(result);
    } catch (error) {
      // Log error event with purchase context
      telemetry.logError({
        requestId: req.requestId,
        message: error.message,
        stack: error.stack,
        statusCode: 400,
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        errorType: 'PurchaseProcessingError',
        metadata: {
          purchaseData: req.body
        }
      });

      res.status(400).json({ status: "Rejected", error: error.message });
    }
  }

  async getPurchases(req, res, next) {
    try {
      const purchases = await this.purchaseService.getAllPurchases();
      res.status(200).json(purchases);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving purchases" });
    }
  }

  async getPurchasesByClient(req, res, next) {
    try {
      const clientId = req.params.clientId;
      const purchases = await this.purchaseService.getPurchasesByClient(
        clientId
      );
      res.status(200).json(purchases);
    } catch (error) {
      res.status(404).json({ error: "Client not found" });
    }
  }
}

// Instantiate with a concrete PurchaseService and export handlers expected by routes
const purchaseService = require("../services/PurchaseService");
const purchaseControllerInstance = new PurchaseController(purchaseService);

// Export functions with names expected by the router
module.exports = {
  processPurchase: purchaseControllerInstance.processPurchase.bind(
    purchaseControllerInstance
  ),
  // alias: getAllPurchases and getPurchases (some routers may expect either)
  getAllPurchases: purchaseControllerInstance.getPurchases.bind(
    purchaseControllerInstance
  ),
  getPurchases: purchaseControllerInstance.getPurchases.bind(
    purchaseControllerInstance
  ),
  // export both possible names for client-specific lookup
  getPurchasesByClientId: purchaseControllerInstance.getPurchasesByClient.bind(
    purchaseControllerInstance
  ),
  getPurchasesByClient: purchaseControllerInstance.getPurchasesByClient.bind(
    purchaseControllerInstance
  ),
};
