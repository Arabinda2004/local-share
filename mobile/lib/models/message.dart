class Message {
  final String id;
  final String from;
  final String to;
  final String content;
  final DateTime timestamp;
  final bool delivered;

  Message({
    required this.id,
    required this.from,
    required this.to,
    required this.content,
    required this.timestamp,
    this.delivered = false,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'].toString(),
      from: json['from'] as String,
      to: json['to'] as String,
      content: json['content'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      delivered: json['delivered'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'from': from,
        'to': to,
        'content': content,
        'timestamp': timestamp.toIso8601String(),
        'delivered': delivered,
      };
}
