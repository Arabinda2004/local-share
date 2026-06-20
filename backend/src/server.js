import express from 'express';
import os from 'os';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Database from './db/database.js';
import logger from './utils/logger.js';
import { initializeWebSocketHandler } from './handlers/websocketHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import deviceRoutes from './routes/devices.js';
import qrRoutes from './routes/qr.js';
import deviceRegistry from './services/deviceRegistry.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

// For local network file sharing, accept connections from any origin
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsConfig = corsOrigin === '*'
    ? { origin: true, methods: ['GET', 'POST'], credentials: true }
    : { origin: corsOrigin, methods: ['GET', 'POST'], credentials: true };

const io = new Server(httpServer, { cors: corsConfig });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const DB_PATH = resolve(process.env.DB_PATH || './data/localshare.db');

// Database instance
let db = null;

// Middleware
app.use(cors(corsOrigin === '*'
    ? { origin: true, credentials: true }
    : { origin: corsOrigin, credentials: true }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        connectedDevices: deviceRegistry.getDeviceCount()
    });
});

// API Routes
app.use('/api/devices', deviceRoutes);
app.use('/api/qr', qrRoutes);

// Error handler middleware (must be last)
app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: req.path
    });
});

// Initialize server
async function initialize() {
    try {
        // Initialize database
        logger.info('Initializing database...');
        db = new Database(DB_PATH);
        await db.initialize();
        deviceRegistry.setDatabase(db);

        logger.info('Database initialized successfully');

        // Initialize WebSocket handlers
        initializeWebSocketHandler(io, db);

        // Start HTTP server
        httpServer.listen(PORT, HOST, () => {
            logger.info(`Backend server running on http://${HOST}:${PORT}`);
            logger.info(`WebSocket ready on ws://${HOST}:${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

            // Show LAN IP addresses for mobile device connection
            const interfaces = os.networkInterfaces();
            for (const [name, addrs] of Object.entries(interfaces)) {
                for (const addr of addrs) {
                    if (addr.family === 'IPv4' && !addr.internal) {
                        logger.info(`📱 Mobile connect URL: http://${addr.address}:${PORT}`);
                    }
                }
            }
        });
    } catch (err) {
        logger.error('Failed to initialize server:', err);
        process.exit(1);
    }
}

// Graceful shutdown
async function shutdown() {
    logger.info('Shutting down gracefully...');

    if (db) {
        await db.close();
    }

    io.close();
    httpServer.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });

    // Force exit after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Start application
initialize().catch(err => {
    logger.error('Fatal error:', err);
    process.exit(1);
});

export default app;
