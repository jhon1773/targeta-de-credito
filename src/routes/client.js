const express = require('express');
const ClientController = require('../controllers/ClientController');

const router = express.Router();

// POST /client - Registrar un nuevo cliente
router.post('/', ClientController.registerClient);

// GET /client - Obtener todos los clientes (útil para testing)
router.get('/', ClientController.getAllClients);

// GET /client/:id - Obtener un cliente específico por ID
router.get('/:id', ClientController.getClient);

module.exports = router;