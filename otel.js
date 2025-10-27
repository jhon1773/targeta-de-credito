// OpenTelemetry initialization for console exporter (Node.js)
// Defensive: some opentelemetry package versions may not return promises from start()/shutdown()
// or may be missing. This module attempts to initialize telemetry but never throws synchronously
// during require time; it logs errors and keeps the process running.
let sdk = null;
try {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

  sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  // Start in a safe async context, but protect against non-promise returns
  (async () => {
    try {
      const maybePromise = sdk.start && sdk.start();
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      console.log('OpenTelemetry initialized (console exporter)');
    } catch (err) {
      console.error('Error initializing OpenTelemetry:', err && err.message ? err.message : err);
    }
  })();

  // Graceful shutdown handlers — guard shutdown() the same way
  const gracefulShutdown = async (signal) => {
    try {
      if (!sdk) return;
      const maybeShutdown = sdk.shutdown && sdk.shutdown();
      if (maybeShutdown && typeof maybeShutdown.then === 'function') {
        await maybeShutdown;
      }
      console.log(`OpenTelemetry terminated (${signal || 'signal'})`);
    } catch (err) {
      console.error('Error during OpenTelemetry shutdown:', err && err.message ? err.message : err);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('exit', () => gracefulShutdown('exit'));
} catch (e) {
  // If requires fail (packages not installed), log and continue. Do not throw.
  console.warn('OpenTelemetry packages not available or failed to initialize:', e && e.message ? e.message : e);
}

module.exports = sdk;
