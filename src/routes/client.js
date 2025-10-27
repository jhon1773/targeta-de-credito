const express = require('express');
const ClientController = require('../controllers/ClientController');

const router = express.Router();

// Registrar Cliente
router.post('/', ClientController.registerClient);

// Obtener todos los clientes
router.get('/', ClientController.getAllClients);

// Obtener cliente por ID
router.get('/:id', ClientController.getClientById);

module.exports = router;