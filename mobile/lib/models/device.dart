class Device {
  final String id;
  final String name;
  final String type;
  final String? ipAddress;
  final int? port;
  final DateTime? lastSeen;
  final bool trusted;

  Device({
    required this.id,
    required this.name,
    required this.type,
    this.ipAddress,
    this.port,
    this.lastSeen,
    this.trusted = false,
  });

  factory Device.fromJson(Map<String, dynamic> json) {
    return Device(
      id: json['id'] as String,
      name: json['name'] as String,
      type: json['type'] as String,
      ipAddress: json['ipAddress'] as String?,
      port: json['port'] as int?,
      lastSeen: json['lastSeen'] != null
          ? DateTime.parse(json['lastSeen'] as String)
          : null,
      trusted: json['trusted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'type': type,
        'ipAddress': ipAddress,
        'port': port,
        'lastSeen': lastSeen?.toIso8601String(),
        'trusted': trusted,
      };
}
