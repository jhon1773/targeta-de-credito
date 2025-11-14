const { Axiom } = require('@axiomhq/js');
require('dotenv').config();

class AxiomTelemetry {
    constructor() {
        this.axiom = null;
        this.dataset = process.env.AXIOM_DATASET;
        this.enabled = false;
        this.initialize();
    }

    initialize() {
        try {
            const token = process.env.AXIOM_TOKEN;

            if (!token || !this.dataset) {
                console.warn('⚠️  Axiom telemetry is not configured. Set AXIOM_TOKEN and AXIOM_DATASET in .env file');
                return;
            }

            this.axiom = new Axiom({ token });
            this.enabled = true;
            console.log('✅ Axiom telemetry initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Axiom telemetry:', error.message);
            this.enabled = false;
        }
    }

    async logRequest(data) {
        if (!this.enabled) return;

        try {
            const event = {
                _time: new Date().toISOString(),
                type: 'request',
                method: data.method,
                url: data.url,
                path: data.path,
                statusCode: data.statusCode,
                duration: data.duration,
                ip: data.ip,
                userAgent: data.userAgent,
                query: data.query,
                params: data.params,
                requestId: data.requestId,
                ...data.metadata
            };

            await this.axiom.ingest(this.dataset, [event]);
        } catch (error) {
            console.error('Failed to log request to Axiom:', error.message);
        }
    }

    async logBusinessEvent(data) {
        if (!this.enabled) return;

        try {
            const event = {
                _time: new Date().toISOString(),
                type: 'business',
                eventName: data.eventName,
                eventType: data.eventType,
                ...data.details,
                requestId: data.requestId
            };

            await this.axiom.ingest(this.dataset, [event]);
        } catch (error) {
            console.error('Failed to log business event to Axiom:', error.message);
        }
    }

    async logError(data) {
        if (!this.enabled) return;

        try {
            const event = {
                _time: new Date().toISOString(),
                type: 'error',
                message: data.message,
                stack: data.stack,
                statusCode: data.statusCode,
                method: data.method,
                url: data.url,
                path: data.path,
                requestId: data.requestId,
                errorType: data.errorType || 'UnknownError',
                ...data.metadata
            };

            await this.axiom.ingest(this.dataset, [event]);
        } catch (error) {
            console.error('Failed to log error to Axiom:', error.message);
        }
    }

    async logPerformance(data) {
        if (!this.enabled) return;

        try {
            const event = {
                _time: new Date().toISOString(),
                type: 'performance',
                operation: data.operation,
                duration: data.duration,
                memoryUsage: data.memoryUsage,
                cpuUsage: data.cpuUsage,
                requestId: data.requestId,
                ...data.metadata
            };

            await this.axiom.ingest(this.dataset, [event]);
        } catch (error) {
            console.error('Failed to log performance metrics to Axiom:', error.message);
        }
    }

    async flush() {
        if (!this.enabled) return;

        try {
            await this.axiom.flush();
        } catch (error) {
            console.error('Failed to flush Axiom events:', error.message);
        }
    }

    isEnabled() {
        return this.enabled;
    }
}

const telemetry = new AxiomTelemetry();

module.exports = telemetry;
