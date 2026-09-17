# 🏫 VKU Real-time Study Room Booking App (React Native & Expo)

> **Mini-Project 2: Mobile-First Campus Study Room Reservations**  
> **Institution:** Vietnam - Korea University of Information and Communication Technology (VKU)  
> **Tech Stack:** React Native, Expo SDK 57, TypeScript, React Navigation 7, TanStack React Query v5, Zustand, Google SSO (@vku.udn.vn), `expo-dev-client`

---

## 📱 Project Overview

VKU students and study groups require a fast, reliable mobile app to check real-time availability and reserve campus computer labs and study rooms without physical door checks or booking collisions.

This application provides a **high-performance mobile reservation experience** tailored for VKU campus buildings (Buildings A, B, C, V) with real-time 2-hour slot conflict prevention, global Zustand state persistence, TanStack Query server state caching, local notification reminders, and interactive SVG QR code booking passes.

---

## ✨ Core Features & Specifications

### 1. 🔑 Google Authentication & Strict VKU Domain Restriction (`@vku.udn.vn`)
- **Single Sign-On Gate:** Authenticates users via Google SSO.
- **Strict Domain Enforcement:** Only emails ending in `@vku.udn.vn` (e.g. `student@vku.udn.vn` or `teacher@vku.udn.vn`) are authorized. Non-VKU domains (e.g. `@gmail.com`) are blocked with a security alert.

### 2. ⚡ Server & Client State Engine (TanStack Query + Zustand)
- **TanStack React Query v5 (`@tanstack/react-query`):** Manages server-side room data fetching, automatic background refetching, and query caching (`staleTime: 5 mins`).
- **Zustand (`useBookingStore` & `useAuthStore`):** Client state management with `@react-native-async-storage/async-storage` for offline persistence of reservations and SSO user sessions.

### 3. 🔍 Room Discovery & Multi-Parameter Filter Engine
- **60 FPS FlatList Feed:** Optimized list rendering using `React.memo` with custom prop comparison, `getItemLayout`, `initialNumToRender`, `maxToRenderPerBatch`, and `removeClippedSubviews`.
- **Target UI Wireframe & Dropdown Filter:** Top header search bar `🔍 [Search rooms...]` + `[Filter ▼]` dropdown modal for buildings (Building A, Building B, Building C, Building V), seat capacity (2–4, 5–10, 10+), and equipment.

### 4. ⏰ Interactive Time-Slot Selector & Conflict Engine
- **7-Day Horizon Date Selector:** Interactive horizontal date strip selector.
- **2-Hour Discrete Time Slots:** Standardized university blocks (`07:30–09:30`, `09:30–11:30`, `13:00–15:00`, `15:00–17:00`, `17:30–19:30`, `19:30–21:30`).
- **Real-Time Conflict Prevention:** Conflicting slots are immediately disabled with an `OCCUPIED` status tag.

### 5. 🎟️ Interactive QR Check-In Booking Pass
- Generates a unique secure SVG QR code payload using `react-native-qrcode-svg`.
- Allows students to simulate a door scanner check-in to validate occupancy.

---

## 🛠️ Development Build Setup (`expo-dev-client`)

This project is configured with `expo-dev-client` to support custom native development builds for Android and iOS.

### 1. What is a Development Build?
A Development Build allows you to run your project on any device or emulator with your custom native code dependencies included, avoiding Expo Go SDK version mismatches.

### 2. How to Create a Development Build

#### Method A: Cloud Build via EAS CLI (Recommended for APK download)
1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to Expo:**
   ```bash
   eas login
   ```
3. **Build the Development APK:**
   ```bash
   eas build --platform android --profile development
   ```
   *Download and install the resulting `.apk` on your Android smartphone or emulator.*

#### Method B: Local Native Build (Android Studio required)
Generate and compile the native Android folder locally:
```bash
npx expo run:android
```

---

## 💻 Running the Application

### 1. Launch with Development Build Mode
After installing your Development Build APK on your phone or emulator, start the Metro server:
```bash
npx expo start --dev-client
```
or start Expo CLI and press `s` to switch to **Development Build** mode:
```bash
npm start
```
Scan the QR code to open your app inside the **Development Build**.

### 2. Expo Web Preview (Browser Demo)
Run the application instantly in your desktop web browser:
```bash
npm run web
```

---

## 📦 Production & Preview APK Builds

To build a standalone **Preview APK** (without development tools):
```bash
eas build --platform android --profile preview
```

---

## 📁 Project Directory Structure

```
StudyRoomBookingApp/
├── App.tsx                      # QueryClientProvider & React Navigation 7 shell
├── app.json                     # Expo SDK 57 configuration & plugins
├── eas.json                     # EAS Build configuration (development & preview profiles)
├── package.json                 # Dependencies & expo-dev-client
├── docs/
│   └── Technical_Report.md      # Technical Project Report
└── src/
    ├── components/              # UI Components
    │   ├── FilterBar.tsx        # Search input & [Filter ▼] dropdown
    │   ├── Header.tsx           # VKU brand header & student badge
    │   ├── QRTicketModal.tsx    # SVG QR booking pass modal
    │   ├── RoomCard.tsx         # Memoized 60fps room card
    │   └── SlotPicker.tsx       # 7-day date selector & conflict slot grid
    ├── hooks/
    │   └── useRoomsQuery.ts     # TanStack React Query room fetching hook
    ├── services/
    │   └── api.ts               # Simulated server API service
    ├── screens/                 # Screen Views
    │   ├── HomeScreen.tsx       # Browse Rooms feed & TanStack Query bar
    │   ├── LoginScreen.tsx      # Google SSO & @vku.udn.vn domain gate
    │   ├── MyBookingsScreen.tsx # Reservations manager & history
    │   ├── ProfileScreen.tsx    # VKU Student ID card & notification test
    │   └── RoomDetailScreen.tsx # Room details & slot picker engine
    ├── store/                   # Zustand Stores
    │   ├── useAuthStore.ts      # Google SSO session & @vku.udn.vn validator
    │   ├── useBookingStore.ts   # Reservation state & AsyncStorage
    │   ├── useFilterStore.ts    # Filter state
    │   └── useUserStore.ts      # Legacy user store
    └── types/
        └── index.ts             # TypeScript interfaces
```
