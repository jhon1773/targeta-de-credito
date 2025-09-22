# VISE Payment API

API REST para el procesamiento de pagos con diferentes tipos de tarjetas VISE.

## 📋 Descripción

Esta API permite registrar clientes y procesar compras aplicando las restricciones y beneficios específicos de cada tipo de tarjeta VISE (Classic, Gold, Platinum, Black, White).

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📊 Endpoints

### 1. Registrar Cliente
**POST** `/client`

Registra un cliente si es apto para el tipo de tarjeta solicitada.

#### Request Body:
```json
{
  "name": "John Doe",
  "country": "USA",
  "monthlyIncome": 1200,
  "viseClub": true,
  "cardType": "Platinum"
}
```

#### Response (Éxito):
```json
{
  "clientId": 1,
  "name": "John Doe",
  "cardType": "Platinum",
  "status": "Registered",
  "message": "Cliente apto para tarjeta Platinum"
}
```

#### Response (Error):
```json
{
  "status": "Rejected",
  "error": "El cliente no cumple con la suscripción VISE CLUB requerida para Platinum"
}
```

### 2. Procesar Compra
**POST** `/purchase`

Procesa una compra aplicando las restricciones y beneficios de la tarjeta.

#### Request Body:
```json
{
  "clientId": 1,
  "amount": 250,
  "currency": "USD",
  "purchaseDate": "2025-09-20T14:30:00Z",
  "purchaseCountry": "France"
}
```

#### Response (Aprobada):
```json
{
  "status": "Approved",
  "purchase": {
    "clientId": 1,
    "originalAmount": 250,
    "discountApplied": 75,
    "finalAmount": 175,
    "benefit": "Sábado - Descuento 30%"
  }
}
```

#### Response (Rechazada):
```json
{
  "status": "Rejected",
  "error": "El cliente con tarjeta Black no puede realizar compras desde China"
}
```

### 3. Endpoints Adicionales

- **GET** `/health` - Estado de la API
- **GET** `/client` - Obtener todos los clientes
- **GET** `/client/:id` - Obtener cliente por ID
- **GET** `/purchase` - Obtener todas las compras
- **GET** `/purchase/client/:clientId` - Obtener compras de un cliente

## 💳 Tipos de Tarjeta

### Classic
- **Restricciones:** Ninguna
- **Beneficios:** Ninguno

### Gold
- **Restricciones:** Ingreso mínimo de $500 USD mensuales
- **Beneficios:** 
  - Lunes, martes y miércoles: 15% de descuento en compras > $100 USD

### Platinum
- **Restricciones:** 
  - Ingreso mínimo de $1000 USD mensuales
  - Suscripción VISE CLUB requerida
- **Beneficios:**
  - Lunes, martes y miércoles: 20% de descuento en compras > $100 USD
  - Sábados: 30% de descuento en compras > $200 USD
  - Compras internacionales: 5% de descuento

### Black
- **Restricciones:**
  - Ingreso mínimo de $2000 USD mensuales
  - Suscripción VISE CLUB requerida
  - No disponible para residentes de: China, Vietnam, India, Irán
- **Beneficios:**
  - Lunes, martes y miércoles: 25% de descuento en compras > $100 USD
  - Sábados: 35% de descuento en compras > $200 USD
  - Compras internacionales: 5% de descuento

### White
- **Restricciones:** Mismas que Black
- **Beneficios:**
  - Lunes a viernes: 25% de descuento en compras > $100 USD
  - Sábados y domingos: 35% de descuento en compras > $200 USD
  - Compras internacionales: 5% de descuento

## 🧪 Ejemplos de Prueba

### Registrar cliente Gold
```bash
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "country": "México",
    "monthlyIncome": 800,
    "viseClub": false,
    "cardType": "Gold"
  }'
```

### Procesar compra con descuento
```bash
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "amount": 150,
    "currency": "USD",
    "purchaseDate": "2025-09-22T10:00:00Z",
    "purchaseCountry": "USA"
  }'
```

### Verificar estado de la API
```bash
curl http://localhost:3000/health
```

## 🏗️ Estructura del Proyecto

```
vise-payment-api/
├── server.js                 # Servidor principal
├── package.json              # Configuración del proyecto
├── README.md                 # Documentación
└── src/
    ├── models/               # Modelos de datos
    │   ├── Client.js         # Modelo de cliente
    │   └── Purchase.js       # Modelo de compra
    ├── controllers/          # Controladores
    │   ├── ClientController.js
    │   └── PurchaseController.js
    ├── services/             # Lógica de negocio
    │   └── CardBenefitsService.js
    └── routes/               # Definición de rutas
        ├── client.js
        └── purchase.js
```

## 🔧 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **CORS** - Manejo de CORS
- **Helmet** - Seguridad básica

## 📝 Notas de Implementación

1. Los datos se almacenan en memoria (no persistentes)
2. Los IDs se generan de forma incremental
3. Los descuentos se pueden acumular cuando aplican múltiples beneficios
4. Las fechas deben estar en formato ISO 8601
5. Los montos se redondean a 2 decimales

## 🎯 Casos de Prueba Sugeridos

### Casos de éxito:
1. Registrar cliente Classic (sin restricciones)
2. Registrar cliente Gold con ingreso suficiente
3. Compra con descuento de día de semana
4. Compra internacional con descuento adicional

### Casos de error:
1. Cliente Gold con ingreso insuficiente
2. Cliente Platinum sin VISE CLUB
3. Cliente Black desde país restringido
4. Compra desde país restringido para tarjeta Black/White

## 🚨 Códigos de Estado HTTP

- `200` - Compra procesada exitosamente
- `201` - Cliente registrado exitosamente
- `400` - Error en los datos de entrada o restricciones no cumplidas
- `404` - Cliente no encontrado
- `500` - Error interno del servidor