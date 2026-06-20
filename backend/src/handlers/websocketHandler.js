import logger from '../utils/logger.js';
import deviceRegistry from '../services/deviceRegistry.js';

export function initializeWebSocketHandler(io, db) {
    io.on('connection', (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        // Handle device registration
        socket.on('device:register', async (data) => {
            try {
                const { name, type, ip, port } = data;

                if (!name || !type) {
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                // Generate device ID if not provided
                const deviceId = data.deviceId || `${type}-${Date.now()}`;

                // Register device
                const device = await deviceRegistry.registerDevice(
                    deviceId,
                    name,
                    type,
                    ip || socket.handshake.address,
                    port || 3000
                );

                // Store socket mapping
                socket.deviceId = deviceId;
                socket.join(`device:${deviceId}`);

                logger.info(`Device registered via WebSocket: ${deviceId}`);

                // Notify all clients about updated device list
                io.emit('device:list', deviceRegistry.listDevices());

                // Send back device info
                socket.emit('device:registered', device);
            } catch (err) {
                logger.error('Error registering device:', err);
                socket.emit('error', { message: 'Failed to register device' });
            }
        });

        // Handle message sending
        socket.on('message:send', async (data) => {
            try {
                const { to, content } = data;

                if (!to || !content) {
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                const from = socket.deviceId;

                if (!from) {
                    socket.emit('error', { message: 'Device not registered' });
                    return;
                }

                // Store message in database
                if (db) {
                    await db.run(
                        `INSERT INTO messages (from_device_id, to_device_id, content, delivered)
             VALUES (?, ?, ?, 0)`,
                        [from, to, content]
                    );
                }

                logger.debug(`Message from ${from} to ${to}: ${content.substring(0, 50)}...`);

                // Send message to recipient
                io.to(`device:${to}`).emit('message:received', {
                    from,
                    to,
                    fromName: deviceRegistry.getDevice(from)?.name || from,
                    content,
                    timestamp: new Date().toISOString()
                });

                // Emit delivery confirmation
                socket.emit('message:sent', {
                    to,
                    content,
                    timestamp: new Date().toISOString()
                });
            } catch (err) {
                logger.error('Error sending message:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Handle message history request
        socket.on('message:history', async (data) => {
            try {
                const { deviceId } = data;
                const from = socket.deviceId;

                if (!from || !deviceId) {
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                if (!db) {
                    socket.emit('message:history:response', []);
                    return;
                }

                // Fetch message history
                const messages = await db.all(
                    `SELECT * FROM messages 
           WHERE (from_device_id = ? AND to_device_id = ?) 
              OR (from_device_id = ? AND to_device_id = ?)
           ORDER BY timestamp ASC
           LIMIT 100`,
                    [from, deviceId, deviceId, from]
                );

                socket.emit('message:history:response', messages.map(msg => ({
                    id: msg.id,
                    from: msg.from_device_id,
                    to: msg.to_device_id,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    delivered: msg.delivered === 1
                })));

                logger.debug(`Sent ${messages.length} messages to ${from}`);
            } catch (err) {
                logger.error('Error retrieving message history:', err);
                socket.emit('error', { message: 'Failed to retrieve history' });
            }
        });

        // Handle device list request
        socket.on('device:list:request', () => {
            try {
                socket.emit('device:list', deviceRegistry.listDevices());
            } catch (err) {
                logger.error('Error retrieving device list:', err);
                socket.emit('error', { message: 'Failed to retrieve device list' });
            }
        });

        // Handle device trust
        socket.on('device:trust', async (data) => {
            try {
                const { deviceId } = data;
                await deviceRegistry.markTrusted(deviceId);

                io.emit('device:list', deviceRegistry.listDevices());
                socket.emit('device:trusted', { deviceId, success: true });
            } catch (err) {
                logger.error('Error trusting device:', err);
                socket.emit('error', { message: 'Failed to trust device' });
            }
        });

        // Handle device untrust
        socket.on('device:untrust', async (data) => {
            try {
                const { deviceId } = data;
                await deviceRegistry.markUntrusted(deviceId);

                io.emit('device:list', deviceRegistry.listDevices());
                socket.emit('device:untrusted', { deviceId, success: true });
            } catch (err) {
                logger.error('Error untrusting device:', err);
                socket.emit('error', { message: 'Failed to untrust device' });
            }
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            try {
                if (socket.deviceId) {
                    logger.info(`Device disconnected: ${socket.deviceId}`);

                    // Remove from registry
                    await deviceRegistry.unregisterDevice(socket.deviceId);

                    // Notify all clients
                    io.emit('device:list', deviceRegistry.listDevices());
                    io.emit('device:disconnected', {
                        deviceId: socket.deviceId,
                        name: deviceRegistry.getDevice(socket.deviceId)?.name || socket.deviceId
                    });
                }
            } catch (err) {
                logger.error('Error handling disconnect:', err);
            }
        });

        // Handle errors
        socket.on('error', (err) => {
            logger.error('Socket error:', err);
        });
    });

    logger.info('WebSocket handler initialized');
}

export default initializeWebSocketHandler;
