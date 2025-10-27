class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  async registerClient(req, res) {
    try {
      const clientData = req.body;
      const result = await this.clientService.register(clientData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ status: "Rejected", error: error.message });
    }
  }

  async getAllClients(req, res) {
    try {
      const clients = await this.clientService.getAll();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving clients" });
    }
  }

  async getClientById(req, res) {
    try {
      const clientId = req.params.id;
      const client = await this.clientService.getById(clientId);
      if (client) {
        res.status(200).json(client);
      } else {
        res.status(404).json({ error: "Client not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error retrieving client" });
    }
  }
}

// Instantiate with the concrete service (CommonJS friendly)
const clientService = require("../services/ClientService");
const clientControllerInstance = new ClientController(clientService);

module.exports = clientControllerInstance;
