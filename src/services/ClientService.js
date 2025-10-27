const Client = require('../models/Client');

// Simple in-memory client store for demo / local development
class ClientService {
    constructor() {
        this.clients = [];
        this.nextId = 1;
    }

    async register(clientData) {
        const client = new Client(this.nextId++, clientData.name, clientData.country, clientData.monthlyIncome, clientData.viseClub, clientData.cardType);
        this.clients.push(client);
        return client;
    }

    async getAll() {
        return this.clients;
    }

    async getById(id) {
        const numericId = Number(id);
        return this.clients.find(c => c.id === numericId) || null;
    }
}

module.exports = new ClientService();
