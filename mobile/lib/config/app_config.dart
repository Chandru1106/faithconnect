class AppConfig {
  // API Configuration
  static const String baseUrl = 'http://192.168.29.1:5000'; // Your computer's IP
  // Now your phone can connect to the backend!
  
  static const String apiUrl = '$baseUrl/api';
  
  // Endpoints
  static const String authEndpoint = '$apiUrl/auth';
  static const String usersEndpoint = '$apiUrl/users';
  static const String postsEndpoint = '$apiUrl/posts';
  static const String reelsEndpoint = '$apiUrl/reels';
  static const String followsEndpoint = '$apiUrl/follows';
  static const String messagesEndpoint = '$apiUrl/messages';
  static const String notificationsEndpoint = '$apiUrl/notifications';
  
  // App Constants
  static const int requestTimeout = 30000; // 30 seconds
  static const int maxImageSize = 5242880; // 5MB
  static const int maxVideoSize = 20971520; // 20MB
  
  // Pagination
  static const int postsPerPage = 20;
  static const int reelsPerPage = 10;
  static const int messagesPerPage = 50;
}
