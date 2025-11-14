const express = require('express');
const router = express.Router();
const clientController = require('../controllers/ClientController');

// Obtener todos los clientes
router.get('/', clientController.getAllClients);

// Registrar un nuevo cliente
router.post('/', clientController.registerClient);

// Obtener cliente por ID
router.get('/:id', clientController.getClientById);

module.exports = router;
