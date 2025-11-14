# 🚀 VISE Payment API

API REST para el registro de clientes y procesamiento de compras con tarjetas VISE (Classic, Gold, Platinum, Black y White), aplicando automáticamente sus restricciones y beneficios.

## 📑 Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Endpoints](#endpoints)
- [Tipos de Tarjeta](#tipos-de-tarjeta)
- [Ejemplos de Prueba](#ejemplos-de-prueba)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Notas de Implementación](#notas-de-implementación)
- [Casos de Prueba Sugeridos](#casos-de-prueba-sugeridos)
- [Códigos de Estado HTTP](#códigos-de-estado-http)

## 📋 Descripción

La VISE Payment API permite:

- ✓ Registrar clientes según su tipo de tarjeta
- ✓ Validar restricciones de tarjetas
- ✓ Procesar compras aplicando descuentos automáticos
- ✓ Registrar operaciones según fecha, país y monto
- ✓ Consultar clientes y compras

Todos los datos se almacenan en memoria, por lo que la API funciona como prototipo o prueba técnica.

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 14+
- npm

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📊 Endpoints

### 1. Registrar Cliente
**POST** `/client`

Registra un cliente si cumple con las restricciones de la tarjeta.

**Request Body:**
```json
{
  "name": "John Doe",
  "country": "USA",
  "monthlyIncome": 1200,
  "viseClub": true,
  "cardType": "Platinum"
}
```

**Respuesta (Éxito):**
```json
{
  "clientId": 1,
  "name": "John Doe",
  "cardType": "Platinum",
  "status": "Registered",
  "message": "Cliente apto para tarjeta Platinum"
}
```

**Respuesta (Error):**
```json
{
  "status": "Rejected",
  "error": "El cliente no cumple con la suscripción VISE CLUB requerida para Platinum"
}
```

### 2. Procesar Compra
**POST** `/purchase`

Procesa una compra aplicando las restricciones y beneficios de la tarjeta.

**Request Body:**
```json
{
  "clientId": 1,
  "amount": 250,
  "currency": "USD",
  "purchaseDate": "2025-09-20T14:30:00Z",
  "purchaseCountry": "France"
}
```

**Respuesta (Aprobada):**
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

**Respuesta (Rechazada):**
```json
{
  "status": "Rejected",
  "error": "El cliente con tarjeta Black no puede realizar compras desde China"
}
```

### 3. Endpoints Adicionales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado de la API |
| GET | `/client` | Lista de clientes |
| GET | `/client/:id` | Cliente por ID |
| GET | `/purchase` | Lista de compras |
| GET | `/purchase/client/:clientId` | Compras por cliente |

## 💳 Tipos de Tarjeta

### Classic
- **Restricciones:** Ninguna
- **Beneficios:** Ninguno

### Gold
- **Restricciones:** Ingreso mínimo de $500 USD mensuales
- **Beneficios:** 
  - Lunes–Miércoles: 15% de descuento en compras > $100 USD

### Platinum
- **Restricciones:** 
  - Ingreso mínimo de $1000 USD mensuales
  - Suscripción VISE CLUB requerida
- **Beneficios:**
  - Lunes–Miércoles: 20% de descuento en compras > $100 USD
  - Sábados: 30% de descuento en compras > $200 USD
  - Compras internacionales: 5% de descuento

### Black
- **Restricciones:**
  - Ingreso mínimo de $2000 USD mensuales
  - Suscripción VISE CLUB requerida
  - No disponible para residentes de: China, Vietnam, India, Irán
- **Beneficios:**
  - Lunes–Miércoles: 25% de descuento en compras > $100 USD
  - Sábados: 35% de descuento en compras > $200 USD
  - Compras internacionales: 5% de descuento

### White
- **Restricciones:** Mismas que Black
- **Beneficios:**
  - Lunes–Viernes: 25% de descuento en compras > $100 USD
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

- Los datos se almacenan en memoria (no persistentes)
- Los IDs se generan de forma incremental
- Los descuentos se pueden acumular cuando aplican múltiples beneficios
- Las fechas deben estar en formato ISO 8601
- Los montos se redondean a 2 decimales

## 🎯 Casos de Prueba Sugeridos

### ✔ Casos de Éxito
1. Registrar cliente Classic (sin restricciones)
2. Registrar cliente Gold con ingreso suficiente
3. Compra con descuento de día de semana
4. Compra internacional con descuento adicional

### ❌ Casos de Error
1. Cliente Gold con ingreso insuficiente
2. Cliente Platinum sin VISE CLUB
3. Cliente Black desde país restringido
4. Compra desde país restringido para tarjeta Black/White

## 🚨 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Compra procesada exitosamente |
| 201 | Cliente registrado exitosamente |
| 400 | Error en datos de entrada o restricciones no cumplidas |
| 404 | Cliente no encontrado |
| 500 | Error interno del servidor |