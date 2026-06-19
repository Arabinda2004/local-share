export String validateIP(String ip) {
  if (ip.isEmpty) return '';
  
  final ipPattern = RegExp(
    r'^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^localhost$|^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$',
  );
  
  return ipPattern.hasMatch(ip) ? '' : 'Invalid IP';
}

export String validatePort(String port) {
  try {
    final portNum = int.parse(port);
    if (portNum > 0 && portNum <= 65535) return '';
  } catch (e) {
    return 'Invalid port';
  }
  return 'Port must be 1-65535';
}

export String validateMessage(String message) {
  if (message.trim().isEmpty) return 'Message cannot be empty';
  if (message.length > 1000) return 'Message too long';
  return '';
}

export bool validateDeviceName(String name) {
  return name.trim().isNotEmpty && name.length <= 50;
}
