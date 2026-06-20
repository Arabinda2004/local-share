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
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563eb), // Tailwind blue-600
          surface: Colors.white,
          background: Colors.white,
        ),
        scaffoldBackgroundColor: Colors.white,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
          centerTitle: true,
        ),
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
