import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _user;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  
  User? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    String? faith,
    String? bio,
  }) async {
    _isLoading = true;
    notifyListeners();
    
    final result = await _authService.register(
      email: email,
      password: password,
      fullName: fullName,
      role: role,
      faith: faith,
      bio: bio,
    );
    
    if (result['success']) {
      _user = result['user'];
      _isAuthenticated = true;
    }
    
    _isLoading = false;
    notifyListeners();
    return result;
  }
  
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();
    
    final result = await _authService.login(email: email, password: password);
    
    if (result['success']) {
      _user = result['user'];
      _isAuthenticated = true;
    }
    
    _isLoading = false;
    notifyListeners();
    return result;
  }
  
  Future<void> loadUser() async {
    final result = await _authService.getMe();
    
    if (result['success']) {
      _user = result['user'];
      _isAuthenticated = true;
      notifyListeners();
    }
  }
  
  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
