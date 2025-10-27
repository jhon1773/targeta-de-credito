class PurchaseController {
  constructor(purchaseService) {
    this.purchaseService = purchaseService;
  }

  async processPurchase(req, res) {
    try {
      const purchaseData = req.body;
      const result = await this.purchaseService.processPurchase(purchaseData);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ status: "Rejected", error: error.message });
    }
  }

  async getPurchases(req, res) {
    try {
      const purchases = await this.purchaseService.getAllPurchases();
      res.status(200).json(purchases);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving purchases" });
    }
  }

  async getPurchasesByClient(req, res) {
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
  getAllPurchases: purchaseControllerInstance.getPurchases.bind(
    purchaseControllerInstance
  ),
  getPurchasesByClientId: purchaseControllerInstance.getPurchasesByClient.bind(
    purchaseControllerInstance
  ),
};
