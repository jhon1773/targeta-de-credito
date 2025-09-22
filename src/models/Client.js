class Client {
    constructor(name, country, monthlyIncome, viseClub, cardType) {
        this.clientId = null; // Se asignará al registrar
        this.name = name;
        this.country = country;
        this.monthlyIncome = monthlyIncome;
        this.viseClub = viseClub;
        this.cardType = cardType;
        this.status = 'Pending'; // Pending, Registered, Rejected
    }

    // Método para validar si el cliente es apto para el tipo de tarjeta solicitada
    static validateCardEligibility(client) {
        const cardType = client.cardType;
        
        switch (cardType) {
            case 'Classic':
                return { isValid: true, message: 'Cliente apto para tarjeta Classic' };
            
            case 'Gold':
                if (client.monthlyIncome < 500) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con el ingreso mínimo de 500 USD mensuales requerido para Gold' 
                    };
                }
                return { isValid: true, message: 'Cliente apto para tarjeta Gold' };
            
            case 'Platinum':
                if (client.monthlyIncome < 1000) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con el ingreso mínimo de 1000 USD mensuales requerido para Platinum' 
                    };
                }
                if (!client.viseClub) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con la suscripción VISE CLUB requerida para Platinum' 
                    };
                }
                return { isValid: true, message: 'Cliente apto para tarjeta Platinum' };
            
            case 'Black':
                if (client.monthlyIncome < 2000) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con el ingreso mínimo de 2000 USD mensuales requerido para Black' 
                    };
                }
                if (!client.viseClub) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con la suscripción VISE CLUB requerida para Black' 
                    };
                }
                const restrictedCountries = ['China', 'Vietnam', 'India', 'Irán'];
                if (restrictedCountries.includes(client.country)) {
                    return { 
                        isValid: false, 
                        message: `El cliente no puede tener tarjeta Black siendo residente de ${client.country}` 
                    };
                }
                return { isValid: true, message: 'Cliente apto para tarjeta Black' };
            
            case 'White':
                // White tiene las mismas restricciones que Black
                if (client.monthlyIncome < 2000) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con el ingreso mínimo de 2000 USD mensuales requerido para White' 
                    };
                }
                if (!client.viseClub) {
                    return { 
                        isValid: false, 
                        message: 'El cliente no cumple con la suscripción VISE CLUB requerida para White' 
                    };
                }
                const restrictedCountriesWhite = ['China', 'Vietnam', 'India', 'Irán'];
                if (restrictedCountriesWhite.includes(client.country)) {
                    return { 
                        isValid: false, 
                        message: `El cliente no puede tener tarjeta White siendo residente de ${client.country}` 
                    };
                }
                return { isValid: true, message: 'Cliente apto para tarjeta White' };
            
            default:
                return { 
                    isValid: false, 
                    message: 'Tipo de tarjeta no válido. Los tipos disponibles son: Classic, Gold, Platinum, Black, White' 
                };
        }
    }
}

module.exports = Client;