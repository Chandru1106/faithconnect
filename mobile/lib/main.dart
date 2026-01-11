import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/app_theme.dart';
import 'providers/auth_provider.dart';
import 'services/api_service.dart';
import 'screens/auth/intro_screen.dart';
import 'screens/worshiper/home_screen.dart';
import 'screens/leader/leader_dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load saved token if exists
  await ApiService().loadToken();
  
  runApp(const FaithConnectApp());
}

class FaithConnectApp extends StatelessWidget {
  const FaithConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'FaithConnect',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const AppInitializer(),
      ),
    );
  }
}

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    if (ApiService().hasToken) {
      await authProvider.loadUser();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (auth.isAuthenticated && auth.user != null) {
          // Navigate based on user role
          if (auth.user!.isLeader) {
            return const LeaderDashboardScreen();
          } else {
            return const HomeScreen();
          }
        }
        
        return const IntroScreen();
      },
    );
  }
}
