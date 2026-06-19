import io from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

class SocketService {
    constructor() {
        this.socket = null;
        this.connected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.socket = io(BACKEND_URL, {
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    reconnectionAttempts: 5
                });

                this.socket.on('connect', () => {
                    console.log('Connected to backend');
                    this.connected = true;
                    resolve();
                });

                this.socket.on('disconnect', () => {
                    console.log('Disconnected from backend');
                    this.connected = false;
                });

                this.socket.on('error', (err) => {
                    console.error('Socket error:', err);
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    registerDevice(name, type) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('Socket not connected'));
                return;
            }

            this.socket.emit('device:register', {
                name,
                type
            });

            this.socket.once('device:registered', (device) => {
                resolve(device);
            });

            this.socket.once('error', (err) => {
                reject(err);
            });
        });
    }

    onDeviceList(callback) {
        if (this.socket) {
            this.socket.on('device:list', callback);
        }
    }

    onMessageReceived(callback) {
        if (this.socket) {
            this.socket.on('message:received', callback);
        }
    }

    sendMessage(toDeviceId, content) {
        if (!this.socket) {
            throw new Error('Socket not connected');
        }

        this.socket.emit('message:send', {
            to: toDeviceId,
            content
        });
    }

    getMessageHistory(deviceId) {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                reject(new Error('Socket not connected'));
                return;
            }

            this.socket.emit('message:history', { deviceId });
            this.socket.once('message:history:response', (messages) => {
                resolve(messages);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
        }
    }

    isConnected() {
        return this.connected;
    }
}

export default new SocketService();
