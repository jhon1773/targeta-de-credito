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
            const purchases = await this.purchaseService.getPurchasesByClient(clientId);
            res.status(200).json(purchases);
        } catch (error) {
            res.status(404).json({ error: "Client not found" });
        }
    }
}

export default PurchaseController;