# Ejemplos de Uso - VISE Payment API

Este archivo contiene ejemplos prácticos para probar todos los casos de uso de la API.

## 🧪 Casos de Prueba para Registro de Clientes

### ✅ Casos de Éxito

#### 1. Cliente Classic (sin restricciones)

```json
POST /client
{
  "name": "Ana López",
  "country": "Colombia",
  "monthlyIncome": 300,
  "viseClub": false,
  "cardType": "Classic"
}
```

**Respuesta esperada:** Status 201 - Cliente registrado

#### 2. Cliente Gold con ingreso suficiente

```json
POST /client
{
  "name": "Carlos Mendoza",
  "country": "Argentina",
  "monthlyIncome": 750,
  "viseClub": false,
  "cardType": "Gold"
}
```

#### 3. Cliente Platinum con todos los requisitos

```json
POST /client
{
  "name": "Laura Silva",
  "country": "Brasil",
  "monthlyIncome": 1500,
  "viseClub": true,
  "cardType": "Platinum"
}
```

#### 4. Cliente Black con todos los requisitos

```json
POST /client
{
  "name": "Roberto Kim",
  "country": "USA",
  "monthlyIncome": 2500,
  "viseClub": true,
  "cardType": "Black"
}
```

#### 5. Cliente White con todos los requisitos

```json
POST /client
{
  "name": "Sophie Martin",
  "country": "France",
  "monthlyIncome": 3000,
  "viseClub": true,
  "cardType": "White"
}
```

### ❌ Casos de Error

#### 1. Cliente Gold con ingreso insuficiente

```json
POST /client
{
  "name": "Pedro González",
  "country": "España",
  "monthlyIncome": 400,
  "viseClub": false,
  "cardType": "Gold"
}
```

**Error esperado:** "El cliente no cumple con el ingreso mínimo de 500 USD mensuales requerido para Gold"

#### 2. Cliente Platinum sin VISE CLUB

```json
POST /client
{
  "name": "María Rodríguez",
  "country": "Chile",
  "monthlyIncome": 1200,
  "viseClub": false,
  "cardType": "Platinum"
}
```

**Error esperado:** "El cliente no cumple con la suscripción VISE CLUB requerida para Platinum"

#### 3. Cliente Black desde país restringido

```json
POST /client
{
  "name": "Li Wei",
  "country": "China",
  "monthlyIncome": 2500,
  "viseClub": true,
  "cardType": "Black"
}
```

**Error esperado:** "El cliente no puede tener tarjeta Black siendo residente de China"

#### 4. Cliente White desde país restringido

```json
POST /client
{
  "name": "Raj Patel",
  "country": "India",
  "monthlyIncome": 2000,
  "viseClub": true,
  "cardType": "White"
}
```

**Error esperado:** "El cliente no puede tener tarjeta White siendo residente de India"

## 💳 Casos de Prueba para Procesamiento de Compras

### ✅ Casos con Beneficios Aplicados

#### 1. Compra Gold - Lunes con descuento 15%

```json
POST /purchase
{
  "clientId": 2,
  "amount": 120,
  "currency": "USD",
  "purchaseDate": "2025-09-22T10:00:00Z",
  "purchaseCountry": "Argentina"
}
```

**Resultado esperado:** Descuento de $18, total final $102

#### 2. Compra Platinum - Sábado con descuento 30%

```json
POST /purchase
{
  "clientId": 3,
  "amount": 250,
  "currency": "USD",
  "purchaseDate": "2025-09-20T14:30:00Z",
  "purchaseCountry": "France"
}
```

**Resultado esperado:** Descuento de $75, total final $175

#### 3. Compra Platinum - Internacional con descuento 5%

```json
POST /purchase
{
  "clientId": 3,
  "amount": 80,
  "currency": "USD",
  "purchaseDate": "2025-09-25T12:00:00Z",
  "purchaseCountry": "Japan"
}
```

**Resultado esperado:** Descuento de $4, total final $76

#### 4. Compra Black - Martes con descuento 25%

```json
POST /purchase
{
  "clientId": 4,
  "amount": 150,
  "currency": "USD",
  "purchaseDate": "2025-09-23T09:00:00Z",
  "purchaseCountry": "USA"
}
```

**Resultado esperado:** Descuento de $37.50, total final $112.50

#### 5. Compra White - Viernes con descuento 25%

```json
POST /purchase
{
  "clientId": 5,
  "amount": 200,
  "currency": "USD",
  "purchaseDate": "2025-09-26T16:00:00Z",
  "purchaseCountry": "France"
}
```

**Resultado esperado:** Descuento de $50, total final $150

#### 6. Compra White - Domingo con descuento 35%

```json
POST /purchase
{
  "clientId": 5,
  "amount": 300,
  "currency": "USD",
  "purchaseDate": "2025-09-21T13:00:00Z",
  "purchaseCountry": "Germany"
}
```

**Resultado esperado:** Descuento de $105 (35%) + $15 (5% internacional) = $120, total final $180

### ❌ Casos de Error en Compras

#### 1. Compra desde país restringido (Black)

```json
POST /purchase
{
  "clientId": 4,
  "amount": 100,
  "currency": "USD",
  "purchaseDate": "2025-09-22T10:00:00Z",
  "purchaseCountry": "China"
}
```

**Error esperado:** "El cliente con tarjeta Black no puede realizar compras desde China"

#### 2. Cliente no encontrado

```json
POST /purchase
{
  "clientId": 999,
  "amount": 100,
  "currency": "USD",
  "purchaseDate": "2025-09-22T10:00:00Z",
  "purchaseCountry": "USA"
}
```

**Error esperado:** "Cliente no encontrado"

#### 3. Datos inválidos - monto negativo

```json
POST /purchase
{
  "clientId": 1,
  "amount": -50,
  "currency": "USD",
  "purchaseDate": "2025-09-22T10:00:00Z",
  "purchaseCountry": "USA"
}
```

**Error esperado:** "amount debe ser un número mayor a 0"

## 📊 Casos de Prueba para Beneficios Combinados

### Compras con múltiples descuentos aplicables

#### 1. Platinum - Sábado + Internacional

```json
POST /purchase
{
  "clientId": 3,
  "amount": 250,
  "currency": "USD",
  "purchaseDate": "2025-09-20T14:30:00Z",
  "purchaseCountry": "Japan"
}
```

**Resultado esperado:**

- Descuento sábado 30%: $75
- Descuento internacional 5%: $12.50
- Total descuento: $87.50
- Total final: $162.50

#### 2. Black - Miércoles + Internacional

```json
POST /purchase
{
  "clientId": 4,
  "amount": 200,
  "currency": "USD",
  "purchaseDate": "2025-09-24T11:00:00Z",
  "purchaseCountry": "Canada"
}
```

**Resultado esperado:**

- Descuento miércoles 25%: $50
- Descuento internacional 5%: $10
- Total descuento: $60
- Total final: $140

## 🔄 Script de Prueba Completo

```bash
# 1. Verificar estado de la API
curl http://localhost:3000/health

# 2. Registrar cliente Classic
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana López","country":"Colombia","monthlyIncome":300,"viseClub":false,"cardType":"Classic"}'

# 3. Registrar cliente Gold
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{"name":"Carlos Mendoza","country":"Argentina","monthlyIncome":750,"viseClub":false,"cardType":"Gold"}'

# 4. Registrar cliente Platinum
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{"name":"Laura Silva","country":"Brasil","monthlyIncome":1500,"viseClub":true,"cardType":"Platinum"}'

# 5. Procesar compra Gold con descuento
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{"clientId":2,"amount":120,"currency":"USD","purchaseDate":"2025-09-22T10:00:00Z","purchaseCountry":"Argentina"}'

# 6. Procesar compra Platinum con descuento sábado
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{"clientId":3,"amount":250,"currency":"USD","purchaseDate":"2025-09-20T14:30:00Z","purchaseCountry":"France"}'

# 7. Ver todos los clientes
curl http://localhost:3000/client

# 8. Ver todas las compras
curl http://localhost:3000/purchase
```

## 📅 Días de la Semana para Pruebas

Para probar los diferentes beneficios por día:

- **Lunes:** 2025-09-22
- **Martes:** 2025-09-23
- **Miércoles:** 2025-09-24
- **Jueves:** 2025-09-25
- **Viernes:** 2025-09-26
- **Sábado:** 2025-09-20
- **Domingo:** 2025-09-21

## 🌍 Países para Pruebas

**Países permitidos:** USA, Canada, Mexico, Brasil, Argentina, Chile, Colombia, France, Germany, Spain, Japan, etc.

**Países restringidos para Black/White:** China, Vietnam, India, Irán
