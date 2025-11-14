const Client = require("../models/Clients");

// Simple in-memory client store for demo / local development
class ClientService {
  constructor() {
    this.clients = []; // Sin datos quemados
    this.nextId = 1;
  }

  async register(clientData) {
    // Validar que el cliente es elegible para el tipo de tarjeta solicitada
    this.validateClientEligibility(clientData);
    
    const client = new Client(
      this.nextId++,
      clientData.name,
      clientData.country,
      clientData.monthlyIncome,
      clientData.viseClub,
      clientData.cardType
    );
    this.clients.push(client);
    return client;
  }

  validateClientEligibility(clientData) {
    const { monthlyIncome, viseClub, cardType } = clientData;
    
    // Validaciones por tipo de tarjeta
    const requirements = {
      Classic: { minIncome: 300, requiresViseClub: false },
      Gold: { minIncome: 1000, requiresViseClub: true },
      Platinum: { minIncome: 2000, requiresViseClub: true },
      Black: { minIncome: 4000, requiresViseClub: true },
      White: { minIncome: 7000, requiresViseClub: true }
    };

    const requirement = requirements[cardType];
    if (!requirement) {
      throw new Error(`Tipo de tarjeta '${cardType}' no válido`);
    }

    // Validar ingreso mínimo
    if (monthlyIncome < requirement.minIncome) {
      throw new Error(`El cliente no cumple con el ingreso mínimo de $${requirement.minIncome} para tarjeta ${cardType}`);
    }

    // Validar VISE Club si es requerido
    if (requirement.requiresViseClub && !viseClub) {
      throw new Error(`El cliente no cumple con la suscripción VISE CLUB requerida para ${cardType}`);
    }
  }

  async getAll() {
    return this.clients;
  }

  async getById(id) {
    const numericId = Number(id);
    return this.clients.find((c) => c.id === numericId) || null;
  }
}

module.exports = new ClientService();
