const telemetry = require('../services/AxiomTelemetry');
const { v4: uuidv4 } = require('crypto');

function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

const telemetryMiddleware = (req, res, next) => {
    if (!telemetry.isEnabled()) {
        return next();
    }

    const requestId = generateRequestId();
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();

    req.requestId = requestId;
    req.startTime = startTime;

    const originalJson = res.json;
    const originalSend = res.send;

    res.json = function (data) {
        res.locals.responseBody = data;
        return originalJson.call(this, data);
    };

    res.send = function (data) {
        if (!res.locals.responseBody) {
            res.locals.responseBody = data;
        }
        return originalSend.call(this, data);
    };

    const originalEnd = res.end;
    res.end = function (...args) {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1e6;
        const endMemory = process.memoryUsage();

        const requestData = {
            requestId,
            method: req.method,
            url: req.originalUrl || req.url,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
            params: Object.keys(req.params).length > 0 ? req.params : undefined,
            metadata: {
                contentType: res.get('content-type'),
                contentLength: res.get('content-length')
            }
        };

        telemetry.logRequest(requestData).catch(err => {
            console.error('Error logging request:', err);
        });

        const memoryDelta = {
            heapUsed: endMemory.heapUsed - startMemory.heapUsed,
            external: endMemory.external - startMemory.external,
            rss: endMemory.rss - startMemory.rss
        };

        const performanceData = {
            requestId,
            operation: `${req.method} ${req.path}`,
            duration,
            memoryUsage: {
                heapUsed: endMemory.heapUsed,
                heapTotal: endMemory.heapTotal,
                external: endMemory.external,
                rss: endMemory.rss,
                delta: memoryDelta
            },
            metadata: {
                statusCode: res.statusCode
            }
        };

        telemetry.logPerformance(performanceData).catch(err => {
            console.error('Error logging performance:', err);
        });

        return originalEnd.apply(this, args);
    };

    next();
};

module.exports = telemetryMiddleware;
