# FaithConnect - Quick Start Guide

## 🎯 Backend Setup (Required First!)

### 1. Setup PostgreSQL Database

**Option A: Using psql command line**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE faithconnect;"

# Run schema (this creates tables and adds sample data)
cd d:\Websites\Humanity\FaithConnect\backend
psql -U postgres -d faithconnect -f database.sql
```

**Option B: Using pgAdmin** 
1. Open pgAdmin
2. Create new database named `faithconnect`
3. Open Query Tool
4. Load and execute `database.sql` file

### 2. Start Backend Server

```bash
cd d:\Websites\Humanity\FaithConnect\backend
npm start
```

✅ **Backend will run on:** `http://localhost:5000`  
✅ **Health check:** `http://localhost:5000/health`

---

## 📱 Mobile App Setup

### Prerequisites Checklist
- ✅ Flutter SDK installed (`flutter doctor`)
- ✅ Android emulator OR physical device
- ✅ Backend server running

### Run on Android Emulator

1. **Start Android Emulator** (from Android Studio)
   
2. **Run the app:**
```bash
cd d:\Websites\Humanity\FaithConnect\mobile
flutter run
```

3. **App will automatically:**
   - Detect your emulator
   - Build and install
   - Launch FaithConnect

### Run on Physical Android Device

1. **Enable Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings → Developer Options → USB Debugging (ON)  

3. **Connect phone via USB**

4. **Run:**
```bash
flutter run
```

---

## 🔨 Build APK for Submission

### Debug APK (Quick Build)
```bash
cd d:\Websites\Humanity\FaithConnect\mobile
flutter build apk
```

**Output:** `build\app\outputs\flutter-apk\app-debug.apk`

### Release APK (Optimized)
```bash
flutter build apk --release
```

**Output:** `build\app\outputs\flutter-apk\app-release.apk`

---

## 🧪 Testing the App

### Test Credentials

The database has sample users ready to test:

**Religious Leaders:**
```
Email: leader1@faith.com
Password: password123
(Pastor John Smith - Christianity)

Email: leader2@faith.com  
Password: password123
(Imam Ahmed Hassan - Islam)

Email: leader3@faith.com
Password: password123
(Rabbi David Cohen - Judaism)
```

**Worshipers:**
```
Email: worshiper1@faith.com
Password: password123
(Sarah Johnson)

Email: worshiper2@faith.com
Password: password123
(Michael Brown)
```

### Test Flow

1. **Launch app** → See beautiful intro screen
2. **Tap "Continue as Worshiper"** → Sign up or login
3. **Navigate** through all tabs (Home, Leaders, Reels, Chats, Notifications)
4. **Logout** from top right
5. **Tap "Continue as Religious Leader"** → Login as leader
6. **View dashboard** with profile card and action cards
7. **Test navigation** between different sections

---

## 🎥 Demo Video Guide

### Recording Tips
- Use screen recording on your Android device or emulator
- Show the complete flow from startup to main features
- Highlight the modern UI and gradient designs

### What to Show (3-5 minutes)

**Intro (30 sec):**
- App launch
- Beautiful intro screen
- Role selection buttons

**Worshiper Flow (90 sec):**
- Signup/login process
- Home feed with tabs (Explore/Following)
- Bottom navigation demonstration
- All 5 tabs shown

**Leader Flow (60 sec):**
- Leader login
- Dashboard with profile card
- Stats display (followers, posts)
- Action cards for content creation

**Design Showcase (30 sec):**
- Highlight gradients
- Show smooth navigation
- Demonstrate modern dark theme

---

## ⚡ Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm start           # Start server

# Mobile
cd mobile
flutter pub get     # Install dependencies
flutter doctor      # Check setup
flutter run         # Run app
flutter build apk   # Build APK
```

---

## 🐛 Troubleshooting

### "No devices connected"
- Start Android emulator first
- OR connect physical device with USB debugging

### "Database connection failed"
- Check PostgreSQL is running
- Verify database `faithconnect` exists
- Check credentials in `backend/.env`

### "Backend not connecting"
- Ensure backend server is running
- For physical device: Update `baseUrl` in `lib/config/app_config.dart` to your computer's IP

### "Flutter command not found"
- Add Flutter to PATH
- Restart terminal

---

## 📦 File Locations

**APK Output:**
```
mobile/build/app/outputs/flutter-apk/
├── app-debug.apk
└── app-release.apk
```

**Backend:**
```
http://localhost:5000
```

**Sample Data:**
All in `backend/database.sql` (already loaded if you ran the setup)

---

## ✅ Pre-Submission Checklist

- [ ] Backend database created and seeded
- [ ] Backend server starts without errors
- [ ] Mobile app runs on Android emulator
- [ ] All test credentials work
- [ ] APK builds successfully
- [ ] Demo video recorded (3-5 min)
- [ ] Both worshiper and leader flows tested

---

## 🎯 Hackathon Submission

1. **Build Release APK:** `flutter build apk --release`
2. **Record Demo Video:** 3-5 minutes showing both flows
3. **Submit Files:** APK + Demo Video to Telegram

---

## 📞 Need Help?

Check the documentation:
- `/backend/README.md` - Backend API docs
- `/mobile/README.md` - Flutter app guide  
- `/README.md` - Project overview

Good luck with your hackathon! 🚀
