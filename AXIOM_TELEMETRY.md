# Telemetría con Axiom - VISE Payment API

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
AXIOM_TOKEN=tu_token_de_axiom_aqui
AXIOM_DATASET=nombre_de_tu_dataset
PORT=3000
NODE_ENV=development
```

### 2. Obtener Credenciales de Axiom

1. Inicia sesión en tu cuenta de Axiom: https://cloud.axiom.co
2. **Token API**:
   - Ve a `Settings` → `API Tokens`
   - Crea un nuevo token con permisos de `ingest`
   - Copia el token generado
3. **Dataset**:
   - Ve a `Datasets`
   - Usa el nombre de tu dataset existente o crea uno nuevo

## Eventos Capturados

### 1. Request/Response (Automático)

Todos los requests HTTP son capturados automáticamente con:
- Método HTTP (GET, POST, etc.)
- URL y path
- Status code
- Duración en milisegundos
- IP del cliente
- User-Agent
- Query params y path params
- Request ID único

### 2. Métricas de Rendimiento (Automático)

Para cada request se captura:
- Duración del request
- Uso de memoria (heap, external, RSS)
- Delta de memoria durante el request

### 3. Eventos de Negocio

#### Registro de Cliente
Evento: `client_registered`
```json
{
  "eventName": "client_registered",
  "eventType": "client",
  "clientId": 1,
  "country": "USA",
  "monthlyIncome": 1500,
  "viseClub": true,
  "cardType": "Gold",
  "status": "Approved"
}
```

#### Procesamiento de Compra
Evento: `purchase_processed`
```json
{
  "eventName": "purchase_processed",
  "eventType": "purchase",
  "purchaseId": "1763083836238-4360",
  "clientId": 1,
  "amount": 250,
  "discount": 0,
  "finalAmount": 250,
  "cardType": "Gold",
  "dayOfWeek": "Friday",
  "isInternational": true,
  "discountPercentage": "0.00"
}
```

### 4. Errores

Todos los errores son capturados con:
- Mensaje de error
- Stack trace completo
- Contexto del request (método, URL, headers)
- Tipo de error categorizado
- Request ID para correlación

## Queries en Axiom

### Ver todos los requests
```
['type'] == 'request'
```

### Ver solo errores
```
['type'] == 'error'
```

### Ver eventos de negocio
```
['type'] == 'business'
```

### Ver compras procesadas
```
['type'] == 'business' and ['eventName'] == 'purchase_processed'
```

### Ver requests lentos (más de 100ms)
```
['type'] == 'request' and ['duration'] > 100
```

### Ver errores de registro de clientes
```
['type'] == 'error' and ['errorType'] == 'ClientRegistrationError'
```

### Análisis de descuentos
```
['type'] == 'business'
and ['eventName'] == 'purchase_processed'
and ['discount'] > 0
| summarize avg(discountPercentage), count() by cardType
```

### Rendimiento por endpoint
```
['type'] == 'performance'
| summarize avg(duration), max(duration), min(duration) by operation
```

## Estructura de Archivos

```
src/
├── services/
│   └── AxiomTelemetry.js          # Servicio de telemetría
├── middleware/
│   └── telemetryMiddleware.js     # Middleware de captura automática
├── controllers/
│   ├── ClientController.js        # Con telemetría de negocio
│   └── PurchaseController.js      # Con telemetría de negocio
└── app.js                         # Integración y graceful shutdown
```

## Características

✅ **Telemetría automática** - Todos los requests se capturan sin código adicional
✅ **Eventos de negocio** - Información detallada de clientes y compras
✅ **Captura de errores** - Stack traces y contexto completo
✅ **Métricas de rendimiento** - Duración y uso de memoria
✅ **Request ID** - Correlación entre todos los eventos de un request
✅ **Graceful shutdown** - Envío de eventos pendientes al cerrar el servidor
✅ **Modo seguro** - Si Axiom no está configurado, la app funciona normalmente

## Pruebas

### Iniciar el servidor
```bash
npm start
```

### Registrar un cliente
```bash
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "country": "USA",
    "monthlyIncome": 1500,
    "viseClub": true,
    "cardType": "Gold"
  }'
```

### Procesar una compra
```bash
curl -X POST http://localhost:3000/purchase \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "amount": 250,
    "currency": "USD",
    "purchaseDate": "2025-11-14T14:30:00Z",
    "purchaseCountry": "France"
  }'
```

## Verificación

1. Ejecuta algunos requests a la API
2. Ve a tu dashboard de Axiom
3. Selecciona tu dataset
4. Deberías ver los eventos apareciendo en tiempo real

## Dashboards Sugeridos en Axiom

### 1. Overview Dashboard
- Total de requests por minuto
- Distribución de status codes
- Requests más lentos
- Tasa de errores

### 2. Business Dashboard
- Clientes registrados por hora
- Compras procesadas
- Descuentos aplicados por tipo de tarjeta
- Compras internacionales vs domésticas

### 3. Performance Dashboard
- Duración promedio por endpoint
- Uso de memoria a lo largo del tiempo
- P95 y P99 de latencia

## Troubleshooting

### La telemetría no aparece en Axiom
1. Verifica que el token y dataset estén correctos en `.env`
2. Revisa que veas el mensaje "✅ Telemetría de Axiom activada" al iniciar
3. Verifica permisos del token (debe tener `ingest`)

### El servidor no inicia
1. Asegúrate de tener el archivo `.env` creado
2. Verifica que todas las dependencias estén instaladas: `npm install`
3. Revisa que el puerto 3000 no esté en uso

### Errores en telemetría no afectan la API
- La telemetría está diseñada para fallar silenciosamente
- Si hay errores enviando a Axiom, solo se registran en consola
- La API sigue funcionando normalmente
