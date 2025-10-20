// OpenTelemetry initialization for console exporter (Node.js)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start()
  .then(() => {
    console.log('OpenTelemetry initialized (console exporter)');
  })
  .catch((error) => {
    console.error('Error initializing OpenTelemetry', error);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown().then(() => console.log('OpenTelemetry terminated')).catch(console.error);
});

module.exports = sdk;
