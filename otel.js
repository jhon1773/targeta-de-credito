// OpenTelemetry initialization for vise-payment-api (console exporter)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start().then(() => {
  console.log('OpenTelemetry initialized for vise-payment-api (console exporter)');
}).catch((err) => console.error('OTEL init error', err));

process.on('SIGTERM', () => {
  sdk.shutdown().then(() => console.log('OpenTelemetry terminated')).catch(console.error);
});

module.exports = sdk;
