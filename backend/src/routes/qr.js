import { Router } from 'express';
import QRCode from 'qrcode';
import deviceRegistry from '../services/deviceRegistry.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Generate QR code for device
router.get('/', asyncHandler(async (req, res) => {
    const { deviceId, format } = req.query;

    if (!deviceId) {
        return res.status(400).json({
            error: 'Missing required parameter',
            code: 'INVALID_INPUT',
            details: 'deviceId query parameter is required'
        });
    }

    try {
        const device = deviceRegistry.getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                error: 'Device not found',
                code: 'NOT_FOUND',
                deviceId
            });
        }

        // Create connection string
        const connectionString = JSON.stringify({
            deviceId: device.id,
            deviceName: device.name,
            type: device.type,
            ip: device.ipAddress,
            port: device.port,
            timestamp: new Date().toISOString()
        });

        logger.debug(`Generating QR code for device: ${deviceId}`);

        // Determine format
        if (format === 'svg') {
            const qrSVG = await QRCode.toString(connectionString, { type: 'svg' });
            res.set('Content-Type', 'image/svg+xml');
            res.send(qrSVG);
        } else if (format === 'json') {
            res.json({
                deviceId: device.id,
                deviceName: device.name,
                connectionString,
                qrDataUrl: await QRCode.toDataURL(connectionString)
            });
        } else {
            // Default: PNG image
            const qrPNG = await QRCode.toBuffer(connectionString, {
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                width: 300,
            });

            res.set('Content-Type', 'image/png');
            res.send(qrPNG);
        }
    } catch (err) {
        logger.error('Error generating QR code:', err);
        res.status(500).json({
            error: 'Failed to generate QR code',
            code: 'QR_ERROR'
        });
    }
}));

export default router;
