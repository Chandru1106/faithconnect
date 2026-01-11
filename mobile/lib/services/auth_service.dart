import '../models/models.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _api = ApiService();
  
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String fullName,
    required String role,
    String? faith,
    String? bio,
    String? profilePhoto,
  }) async {
    try {
      final response = await _api.post('/auth/register', data: {
        'email': email,
        'password': password,
        'fullName': fullName,
        'role': role,
        'faith': faith,
        'bio': bio,
        'profilePhoto': profilePhoto,
      });
      
      if (response.data['success']) {
        final token = response.data['data']['token'];
        await _api.setToken(token);
        return {
          'success': true,
          'user': User.fromJson(response.data['data']['user']),
        };
      }
      
      return {'success': false, 'message': response.data['message']};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
  
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _api.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      
      if (response.data['success']) {
        final token = response.data['data']['token'];
        await _api.setToken(token);
        return {
          'success': true,
          'user': User.fromJson(response.data['data']['user']),
        };
      }
      
      return {'success': false, 'message': response.data['message']};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
  
  Future<Map<String, dynamic>> getMe() async {
    try {
      final response = await _api.get('/auth/me');
      
      if (response.data['success']) {
        return {
          'success': true,
          'user': User.fromJson(response.data['data']),
        };
      }
      
      return {'success': false, 'message': response.data['message']};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }
  
  Future<void> logout() async {
    await _api.clearToken();
  }
}
