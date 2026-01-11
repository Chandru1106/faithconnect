# FaithConnect Mobile App

Modern Flutter application for FaithConnect - Connecting Worshipers with Religious Leaders.

## Features

### Authentication
- **Role-Based Onboarding**: Choose between Worshiper or Religious Leader
- **Email/Password Authentication**: Secure login and registration
- **Automatic Token Management**: Persistent authentication state

### Worshiper Features
- **Home Feed**: Explore and Following tabs for content discovery
- **Leaders Discovery**: Find and follow religious leaders
- **Reels**: Short-form spiritual video content
- **Messaging**: Direct communication with followed leaders
- **Notifications**: Stay updated with new content and interactions

### Leader Features
- **Dashboard**: Overview of followers and content statistics
- **Content Creation**: Create posts and reels
- **Message Management**: Respond to follower messages
- **Analytics**: Track engagement with your content

## Setup

### Prerequisites
- Flutter SDK (3.6.1 or higher)
- Android Studio or VS Code with Flutter extensions
- Android emulator or physical device

### Installation

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
flutter pub get
```

3. Configure API endpoint:
   - Open `lib/config/app_config.dart`
   - For physical device, update `baseUrl` to your computer's IP address:
   ```dart
   static const String baseUrl = 'http://YOUR_IP:5000';
   ```

4. Run the app:
```bash
flutter run
```

### Building APK

For release build:
```bash
flutter build apk --release
```

APK will be located at: `build/app/outputs/flutter-apk/app-release.apk`

## Project Structure

```
lib/
├── config/
│   ├── app_config.dart      # API and app configuration
│   └── app_theme.dart        # Modern dark theme with gradients
├── models/
│   └── models.dart           # Data models (User, Post, Reel, etc.)
├── providers/
│   └── auth_provider.dart    # Authentication state management
├── services/
│   ├── api_service.dart      # HTTP client with interceptors
│   └── auth_service.dart     # Authentication API calls
├── screens/
│   ├── auth/
│   │   ├── intro_screen.dart         # Landing screen
│   │   ├── login_screen.dart         # Login
│   │   └── signup_screen.dart        # Registration
│   ├── worshiper/
│   │   └── home_screen.dart          # Main worshiper interface
│   └── leader/
│       └── leader_dashboard_screen.dart  # Leader dashboard
├── widgets/                  # Reusable UI components
└── main.dart                 # App entry point
```

## Design System

### Theme
- **Modern Dark Theme**: Deep navy background with vibrant accents
- **Color Palette**: 
  - Primary: Vibrant Indigo (#6366F1)
  - Accent: Cyan (#06B6D4)
  - Background: Deep Navy (#0F172A)
- **Gradients**: Eye-catching gradients for CTAs and highlights
- **Typography**: Clean, readable font hierarchy

### UI Components
- **Custom Bottom Navigation**: Gradient-highlighted active state
- **Glassmorphic Cards**: Modern, elegant content containers
- **Smooth Animations**: Subtle micro-interactions
- **Consistent Spacing**: 8px grid system

## Test Credentials

Use these credentials to test the app (must have backend running with sample data):

- **Leader**: `leader1@faith.com` / `password123`
- **Worshiper**: `worshiper1@faith.com` / `password123`

## Development Notes

- State management: Provider pattern
- HTTP client: Dio with interceptors
- Image caching: cached_network_image
- Video playback: video_player
- Local storage: shared_preferences

## Next Steps

1. Integrate all backend APIs
2. Implement post/reel feed with infinite scroll
3. Add leader discovery with search and filters
4. Build messaging system with real-time updates
5. Complete notifications functionality
6. Add image/video upload from device
7. Implement like, comment, save actions
8. Add pull-to-refresh on feeds
9. Build profile editing
10. Add loading states and error handling

## Demo Video Requirements

Cover these flows in your demo:
1. App launch and intro screen
2. Worshiper signup and login
3. Home feed navigation
4. Leader signup and login
5. Leader dashboard overview
6. Basic navigation through all tabs

## Submission

Build APK and create demo video showing:
- Authentication flows
- Role-based interfaces
- Modern UI design
- Navigation between screens
