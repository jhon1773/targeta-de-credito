/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del cliente
 *         name:
 *           type: string
 *           description: Nombre del cliente
 *         country:
 *           type: string
 *           description: País de residencia
 *         monthlyIncome:
 *           type: number
 *           description: Ingreso mensual
 *         viseClub:
 *           type: boolean
 *           description: Si el cliente pertenece a Vise Club
 *         cardType:
 *           type: string
 *           description: Tipo de tarjeta asignada
 */
class Client {
  constructor(id, name, country, monthlyIncome, viseClub, cardType) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.monthlyIncome = monthlyIncome;
    this.viseClub = viseClub;
    this.cardType = cardType;
  }
}

module.exports = Client;