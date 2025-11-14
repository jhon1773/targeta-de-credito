const telemetry = require('../services/AxiomTelemetry');

class ClientController {
  constructor(clientService) {
    this.clientService = clientService;
  }

  /**
   * @swagger
   * /clients:
   *   post:
   *     summary: Registrar un nuevo cliente
   *     tags:
   *       - Clients
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *               email:
   *                 type: string
   *               telefono:
   *                 type: string
   *             required:
   *               - nombre
   *               - email
   *     responses:
   *       201:
   *         description: Cliente registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       400:
   *         description: Datos inválidos
   */
  async registerClient(req, res, next) {
    try {
      const clientData = req.body;
      const result = await this.clientService.register(clientData);

      // Log business event
      telemetry.logBusinessEvent({
        requestId: req.requestId,
        eventName: 'client_registered',
        eventType: 'client',
        details: {
          clientId: result.id,
          country: clientData.country,
          monthlyIncome: clientData.monthlyIncome,
          viseClub: clientData.viseClub,
          cardType: result.cardType,
          status: result.status
        }
      });

      res.status(201).json(result);
    } catch (error) {
      // Log error event
      telemetry.logError({
        requestId: req.requestId,
        message: error.message,
        stack: error.stack,
        statusCode: 400,
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        errorType: 'ClientRegistrationError',
        metadata: {
          clientData: req.body
        }
      });

      res.status(400).json({ status: "Rejected", error: error.message });
    }
  }

  /**
   * @swagger
   * /clients:
   *   get:
   *     summary: Obtener todos los clientes
   *     tags:
   *       - Clients
   *     responses:
   *       200:
   *         description: Lista de clientes
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *       500:
   *         description: Error al recuperar los clientes
   */
  async getAllClients(req, res, next) {
    try {
      const clients = await this.clientService.getAll();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving clients" });
    }
  }

  /**
   * @swagger
   * /clients/{id}:
   *   get:
   *     summary: Obtener cliente por ID
   *     tags:
   *       - Clients
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID del cliente
   *     responses:
   *       200:
   *         description: Cliente encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       404:
   *         description: Cliente no encontrado
   *       500:
   *         description: Error al recuperar el cliente
   */
  async getClientById(req, res, next) {
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

module.exports = {
  registerClient: clientControllerInstance.registerClient.bind(
    clientControllerInstance
  ),
  getAllClients: clientControllerInstance.getAllClients.bind(
    clientControllerInstance
  ),
  getClientById: clientControllerInstance.getClientById.bind(
    clientControllerInstance
  ),
};
