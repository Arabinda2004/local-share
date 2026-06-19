import { Router } from 'express';
import deviceRegistry from '../services/deviceRegistry.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
let db = null;

export function setDatabase(database) {
    db = database;
}

// Register a new device
router.post('/register', asyncHandler(async (req, res) => {
    const { name, type, ip, port } = req.body;

    if (!name || !type) {
        return res.status(400).json({
            error: 'Missing required fields',
            code: 'INVALID_INPUT',
            details: 'name and type are required'
        });
    }

    if (!['web', 'mobile'].includes(type)) {
        return res.status(400).json({
            error: 'Invalid device type',
            code: 'INVALID_INPUT',
            details: 'type must be "web" or "mobile"'
        });
    }

    const deviceId = `${type}-${Date.now()}`;

    try {
        const device = await deviceRegistry.registerDevice(
            deviceId,
            name,
            type,
            ip || '0.0.0.0',
            port || 3000
        );

        logger.info(`Device registered via REST: ${deviceId}`);

        res.status(200).json({
            deviceId: device.id,
            deviceName: device.name,
            connectedDevices: deviceRegistry.listDevices().filter(d => d.id !== deviceId)
        });
    } catch (err) {
        logger.error('Error registering device:', err);
        res.status(500).json({
            error: 'Failed to register device',
            code: 'REGISTER_ERROR'
        });
    }
}));

// List all connected devices
router.get('/list', asyncHandler(async (req, res) => {
    try {
        const devices = deviceRegistry.listDevices();
        res.json(devices);
    } catch (err) {
        logger.error('Error listing devices:', err);
        res.status(500).json({
            error: 'Failed to retrieve devices',
            code: 'LIST_ERROR'
        });
    }
}));

// Get a specific device
router.get('/:deviceId', asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = deviceRegistry.getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                error: 'Device not found',
                code: 'NOT_FOUND',
                deviceId
            });
        }

        res.json(device);
    } catch (err) {
        logger.error('Error retrieving device:', err);
        res.status(500).json({
            error: 'Failed to retrieve device',
            code: 'GET_ERROR'
        });
    }
}));

// Unregister a device
router.delete('/:deviceId', asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = deviceRegistry.getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                error: 'Device not found',
                code: 'NOT_FOUND',
                deviceId
            });
        }

        await deviceRegistry.unregisterDevice(deviceId);

        logger.info(`Device unregistered via REST: ${deviceId}`);

        res.json({
            success: true,
            message: 'Device unregistered',
            deviceId
        });
    } catch (err) {
        logger.error('Error unregistering device:', err);
        res.status(500).json({
            error: 'Failed to unregister device',
            code: 'DELETE_ERROR'
        });
    }
}));

// Trust a device
router.post('/:deviceId/trust', asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = deviceRegistry.getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                error: 'Device not found',
                code: 'NOT_FOUND',
                deviceId
            });
        }

        await deviceRegistry.markTrusted(deviceId);

        logger.info(`Device trusted via REST: ${deviceId}`);

        res.json({
            success: true,
            message: 'Device marked as trusted',
            deviceId
        });
    } catch (err) {
        logger.error('Error trusting device:', err);
        res.status(500).json({
            error: 'Failed to trust device',
            code: 'TRUST_ERROR'
        });
    }
}));

// Untrust a device
router.post('/:deviceId/untrust', asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    try {
        const device = deviceRegistry.getDevice(deviceId);

        if (!device) {
            return res.status(404).json({
                error: 'Device not found',
                code: 'NOT_FOUND',
                deviceId
            });
        }

        await deviceRegistry.markUntrusted(deviceId);

        logger.info(`Device untrusted via REST: ${deviceId}`);

        res.json({
            success: true,
            message: 'Device marked as untrusted',
            deviceId
        });
    } catch (err) {
        logger.error('Error untrusting device:', err);
        res.status(500).json({
            error: 'Failed to untrust device',
            code: 'UNTRUST_ERROR'
        });
    }
}));

export default router;
