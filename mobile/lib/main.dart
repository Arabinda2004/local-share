import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'screens/connection_screen.dart';
import 'screens/chat_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const LocalShareApp(),
    ),
  );
}

class LocalShareApp extends StatelessWidget {
  const LocalShareApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LocalShare',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: Consumer<AppProvider>(
        builder: (context, appProvider, _) {
          return appProvider.isConnected
              ? const ChatScreen()
              : const ConnectionScreen();
        },
      ),
    );
  }
}
