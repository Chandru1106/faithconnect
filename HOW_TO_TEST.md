# How to Test FaithConnect Mobile App - Quick Guide

## 🚀 **3 Ways to Test the App**

---

## ⚡ **OPTION 1: Use Your Android Phone** (FASTEST - 5 minutes)

### Step 1: Enable Developer Mode
1. On your Android phone: **Settings → About Phone**
2. Tap **"Build Number"** 7 times
3. Go back to **Settings → Developer Options**
4. Enable **"USB Debugging"**

### Step 2: Connect & Run
```bash
# Connect phone via USB cable
# On phone: Allow USB debugging when prompted

cd d:\Websites\Humanity\FaithConnect\mobile
flutter run
```

Flutter will detect your phone and install the app automatically! ✨

**⚠️ Important:** Update API URL for physical device:
- Edit: `mobile\lib\config\app_config.dart`
- Change `baseUrl` to your computer's local IP:
  ```dart
  static const String baseUrl = 'http://192.168.X.X:5000';
  ```
  (Find your IP: Run `ipconfig` in terminal, look for IPv4 Address)

---

## 🖥️ **OPTION 2: Install Android Studio** (30-45 minutes)

### Download & Install
1. **Download Android Studio:** https://developer.android.com/studio
2. **Run installer** (accept all defaults)
3. **Open Android Studio** 
4. Click **"More Actions"** → **"SDK Manager"**
5. Install **Android SDK** (should auto-detect and offer to install)

### Create Virtual Device (Emulator)
1. **More Actions** → **"Virtual Device Manager"**
2. **"Create Device"**
3. Choose **"Pixel 6"** → **Next**
4. Download system image (choose latest, e.g., API 33)
5. **Finish** → **Start emulator** (▶️ play button)

### Run App
```bash
cd d:\Websites\Humanity\FaithConnect\mobile
flutter run
```

Select the emulator when prompted!

---

## 🌐 **OPTION 3: Online Android Emulator** (Quick Test - 10 minutes)

Use **Appetize.io** to test without installing anything:

### Steps:
1. **Build APK** (even though SDK isn't installed, we can try debug build):
   ```bash
   cd mobile
   flutter build apk --debug
   ```
   
2. If that fails, **push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "FaithConnect app"
   git push
   ```

3. Use **Codemagic** (free):
   - Sign up: https://codemagic.io
   - Connect GitHub repo
   - Auto-build APK
   - Download and test on Appetize.io

---

## 📱 **What Each Option Gives You:**

| Option | Time | Pros | Cons |
|--------|------|------|------|
| **Phone** | 5 min | Fast, real device testing | Need Android phone |
| **Android Studio** | 45 min | Full dev environment, emulator | Large download (~3GB) |
| **Online Build** | 15 min | No local install needed | Requires GitHub account |

---

## ✅ **My Recommendation:**

**If you have an Android phone:** Use Option 1 (fastest!)

**If no phone:** Install Android Studio (Option 2) - you'll need it for future development anyway

**If testing quickly:** Try Option 3 with online services

---

## 🔧 **Check Your Current Setup:**

Run this to see what you have:
```bash
flutter doctor
```

This will show:
- ✅ What's installed
- ❌ What's missing
- 📝 How to fix issues

---

## 🎯 **After Testing:**

Once app is running, test:
1. **Signup** as worshiper
2. **Login** with `worshiper1@faith.com` / `password123`
3. **Navigate** through all tabs
4. **Logout** and login as leader: `leader1@faith.com` / `password123`
5. **Explore** leader dashboard

---

## 🆘 **Need Help?**

**Flutter not finding devices:**
```bash
flutter devices
```

**Restart ADB (if phone not detected):**
```bash
flutter doctor --android-licenses
adb kill-server
adb start-server
```

**Check backend is running:**
- Open browser: http://localhost:5000/health
- Should show: `{"success":true}`

---

**Choose your option and let me know which one you want to try!** 🚀
