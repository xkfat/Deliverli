import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import './welcome_screen.dart'; // Import your MainScreen

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToHome();
  }

  _navigateToHome() async {
    // Wait for 3 seconds
    await Future.delayed(const Duration(seconds: 3));
    if (!mounted) return;
    
    // Navigate to MainScreen
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => const ForkScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Using your primary gradient for a consistent look
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // --- YOUR LOGO REPLACEMENT ---
            TweenAnimationBuilder(
              duration: const Duration(milliseconds: 1500),
              tween: Tween<double>(begin: 0, end: 1),
              builder: (context, double value, child) {
                return Opacity(
                  opacity: value,
                  child: Transform.scale(
                    scale: 0.8 + (0.2 * value), // Subtle zoom-in effect
                    child: child,
                  ),
                );
              },
              child: Image.asset(
                'assets/images/Logo.png', // Ensure this path matches your pubspec.yaml
                width: 180, // Adjust size as needed
              ),
            ),
            const SizedBox(height: 40),
            // Optional: A clean loader that matches the white logo
            const CircularProgressIndicator(
              color: Colors.white,
              strokeWidth: 3,
            ),
          ],
        ),
      ),
    );
  }
}