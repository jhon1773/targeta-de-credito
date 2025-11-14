const express = require('express');
const router = express.Router();
const clientService = require('../services/ClientService');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  const clients = await clientService.getAll();
  res.json(clients);
});

// Registrar un nuevo cliente
router.post('/', async (req, res) => {
  const newClient = await clientService.register(req.body);
  res.status(201).json(newClient);
});

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  const client = await clientService.getById(req.params.id);
  if (!client) return res.status(404).send('El cliente no fue encontrado');
  res.json(client);
});

module.exports = router;
