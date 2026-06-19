export function validateIP(ip) {
    const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^localhost$|^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
    return ipRegex.test(ip);
}

export function validatePort(port) {
    const portNum = parseInt(port, 10);
    return portNum > 0 && portNum <= 65535 && portNum.toString() === port;
}

export function validateMessage(message) {
    return message && message.trim().length > 0 && message.length <= 1000;
}

export function validateDeviceName(name) {
    return name && name.trim().length > 0 && name.length <= 50;
}

export function formatTimestamp(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
