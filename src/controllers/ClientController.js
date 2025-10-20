const Client = require('../models/Client');


let clients = [];
let nextClientId = 1;

class ClientController {
    
    
    static registerClient(req, res) {
        try {
            const { name, country, monthlyIncome, viseClub, cardType } = req.body;

            
            if (!name || !country || monthlyIncome === undefined || viseClub === undefined || !cardType) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'Todos los campos son requeridos: name, country, monthlyIncome, viseClub, cardType'
                });
            }

            
            if (typeof name !== 'string' || name.trim().length < 2) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'name debe ser un texto de al menos 2 caracteres'
                });
            }

            if (typeof country !== 'string' || country.trim().length < 2) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'country debe ser un texto de al menos 2 caracteres'
                });
            }

            
            if (typeof monthlyIncome !== 'number' || monthlyIncome < 0) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'monthlyIncome debe ser un número mayor o igual a 0'
                });
            }

            if (typeof viseClub !== 'boolean') {
                return res.status(400).json({
                    status: 'Rejected',
                    error: 'viseClub debe ser un valor booleano (true o false)'
                });
            }

            
            const validCardTypes = ['Classic', 'Gold', 'Platinum', 'Black', 'White'];
            if (!validCardTypes.includes(cardType)) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: `Tipo de tarjeta no válido. Los tipos disponibles son: ${validCardTypes.join(', ')}`
                });
            }

            
            const client = new Client(name, country, monthlyIncome, viseClub, cardType);

            
            const eligibilityResult = Client.validateCardEligibility(client);

            if (!eligibilityResult.isValid) {
                return res.status(400).json({
                    status: 'Rejected',
                    error: eligibilityResult.message
                });
            }

            
            client.clientId = nextClientId++;
            client.status = 'Registered';
            clients.push(client);

            
            return res.status(201).json({
                clientId: client.clientId,
                name: client.name,
                cardType: client.cardType,
                status: 'Registered',
                message: eligibilityResult.message
            });

        } catch (error) {
            console.error('Error en registerClient:', error);
            return res.status(500).json({
                status: 'Error',
                error: 'Error interno del servidor'
            });
        }
    }

    
    static getClientById(clientId) {
        return clients.find(client => client.clientId === clientId);
    }

    
    static getAllClients(req, res) {
        return res.json({
            total: clients.length,
            clients: clients
        });
    }

    
    static getClient(req, res) {
        try {
            const clientId = parseInt(req.params.id);
            const client = ClientController.getClientById(clientId);

            if (!client) {
                return res.status(404).json({
                    status: 'Not Found',
                    error: 'Cliente no encontrado'
                });
            }

            return res.json(client);

        } catch (error) {
            console.error('Error en getClient:', error);
            return res.status(500).json({
                status: 'Error',
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = ClientController;
