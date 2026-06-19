export function parseQRData(qrValue) {
    try {
        // QR format: {"deviceId":"xxx","deviceName":"yyy","type":"web/mobile","ip":"127.0.0.1","port":3000}
        const data = JSON.parse(qrValue);

        return {
            deviceId: data.deviceId,
            deviceName: data.deviceName,
            type: data.type,
            ip: data.ip,
            port: data.port,
            timestamp: data.timestamp
        };
    } catch (err) {
        throw new Error('Invalid QR code format');
    }
}

export function extractConnectionDetails(qrData) {
    return {
        ip: qrData.ip,
        port: qrData.port.toString(),
        deviceName: qrData.deviceName
    };
}
