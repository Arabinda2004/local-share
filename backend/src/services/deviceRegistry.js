import logger from '../utils/logger.js';

class DeviceRegistry {
    constructor() {
        this.devices = new Map();
        this.db = null;
    }

    setDatabase(db) {
        this.db = db;
    }

    // Register a new device
    async registerDevice(id, name, type, ip, port) {
        try {
            // Store in memory
            this.devices.set(id, {
                id,
                name,
                type,
                ipAddress: ip,
                port,
                trusted: false,
                lastPairing: new Date(),
                connectedAt: new Date()
            });

            // Store in database
            if (this.db) {
                await this.db.run(
                    `INSERT OR REPLACE INTO devices (id, name, type, ip_address, port, last_pairing)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                    [id, name, type, ip, port]
                );
            }

            logger.info(`Device registered: ${id} (${name})`);
            return this.devices.get(id);
        } catch (err) {
            logger.error('Error registering device:', err);
            throw err;
        }
    }

    // Get device by ID
    getDevice(id) {
        return this.devices.get(id) || null;
    }

    // Get device by IP address
    getDeviceByIP(ip) {
        for (const device of this.devices.values()) {
            if (device.ipAddress === ip) {
                return device;
            }
        }
        return null;
    }

    // List all connected devices
    listDevices() {
        return Array.from(this.devices.values()).map(device => ({
            id: device.id,
            name: device.name,
            type: device.type,
            lastSeen: device.lastPairing?.toISOString(),
            trusted: device.trusted || false
        }));
    }

    // Unregister a device
    async unregisterDevice(id) {
        try {
            this.devices.delete(id);

            if (this.db) {
                await this.db.run(
                    'DELETE FROM devices WHERE id = ?',
                    [id]
                );
            }

            logger.info(`Device unregistered: ${id}`);
            return true;
        } catch (err) {
            logger.error('Error unregistering device:', err);
            throw err;
        }
    }

    // Mark device as trusted
    async markTrusted(id) {
        try {
            const device = this.devices.get(id);
            if (!device) return false;

            device.trusted = true;

            if (this.db) {
                await this.db.run(
                    'UPDATE devices SET trusted = 1 WHERE id = ?',
                    [id]
                );
            }

            logger.info(`Device marked as trusted: ${id}`);
            return true;
        } catch (err) {
            logger.error('Error marking device as trusted:', err);
            throw err;
        }
    }

    // Mark device as untrusted
    async markUntrusted(id) {
        try {
            const device = this.devices.get(id);
            if (!device) return false;

            device.trusted = false;

            if (this.db) {
                await this.db.run(
                    'UPDATE devices SET trusted = 0 WHERE id = ?',
                    [id]
                );
            }

            logger.info(`Device marked as untrusted: ${id}`);
            return true;
        } catch (err) {
            logger.error('Error marking device as untrusted:', err);
            throw err;
        }
    }

    // Check if device is trusted
    isTrusted(id) {
        const device = this.devices.get(id);
        return device ? device.trusted : false;
    }

    // Update last seen
    async updateLastSeen(id) {
        try {
            const device = this.devices.get(id);
            if (!device) return false;

            device.lastPairing = new Date();

            if (this.db) {
                await this.db.run(
                    'UPDATE devices SET last_pairing = CURRENT_TIMESTAMP WHERE id = ?',
                    [id]
                );
            }

            return true;
        } catch (err) {
            logger.error('Error updating last seen:', err);
            throw err;
        }
    }

    // Get device count
    getDeviceCount() {
        return this.devices.size;
    }

    // Clear all devices
    clear() {
        this.devices.clear();
        logger.info('Device registry cleared');
    }
}

export default new DeviceRegistry();
