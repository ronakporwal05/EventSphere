import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryIndigo = Color(0xFF6366F1);
  static const Color accentPurple = Color(0xFFA855F7);
  static const Color darkBackground = Color(0xFF09090B);
  static const Color cardSurface = Color(0xFF18181B);
  static const Color borderNeutral = Color(0xFF27272A);
  static const Color textMuted = Color(0xFFA1A1AA);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryIndigo,
        secondary: accentPurple,
        surface: cardSurface,
        background: darkBackground,
      ),
      cardTheme: CardTheme(
        color: cardSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: borderNeutral),
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
