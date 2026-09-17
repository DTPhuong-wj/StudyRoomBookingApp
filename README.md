# 🏫 VKU Real-time Study Room Booking App (React Native & Expo)

> **Mini-Project 2: Mobile-First Campus Study Room Reservations**  
> **Institution:** Vietnam - Korea University of Information and Communication Technology (VKU)  
> **Tech Stack:** React Native, Expo SDK 52, TypeScript, Zustand, AsyncStorage, Expo Notifications, React Native SVG QR Code

---

## 📱 Project Overview

VKU students and research study groups require a fast, reliable mobile app to check real-time availability and reserve campus computer labs and study rooms without physical door checks or booking collisions.

This application provides a **high-performance mobile reservation experience** tailored for VKU campus buildings (Buildings A, B, C, V) with real-time 2-hour slot conflict prevention, global Zustand state persistence, local notification reminders, and interactive SVG QR code booking passes.

---

## ✨ Core Features & Specifications

### 1. 🔍 Room Discovery & Multi-Parameter Filter Engine
- **60 FPS FlatList Feed:** Optimized list rendering using `React.memo` with custom prop comparison, `getItemLayout`, `initialNumToRender`, `maxToRenderPerBatch`, and `removeClippedSubviews`.
- **Instant Filters:** Filter by building (**A** IT Center, **B** Library, **C** Languages, **V** Innovation Hub), capacity range (2–4, 5–10, 10+ students), and equipment badges (**High-spec PC**, **Projector**, **Whiteboard**, **AC**, **Smart Screen**, **Sound System**).
- **Real-Time Availability Badge:** Dynamic visual status indicator (`Available Now` vs `Occupied`).

### 2. ⏰ Interactive Time-Slot Selector & Conflict Engine
- **7-Day Horizon Date Selector:** Interactive horizontal date strip selector.
- **2-Hour Discrete Time Slots:** Standardized university blocks:
  - `07:30 – 09:30`
  - `09:30 – 11:30`
  - `13:00 – 15:00`
  - `15:00 – 17:00`
  - `17:30 – 19:30`
  - `19:30 – 21:30`
- **Real-Time Visual Conflict Prevention:** Real-time state evaluation against existing active reservations. Conflicting slots are immediately disabled with an `OCCUPIED` status tag.

### 3. 🛡️ Global State Management & Persistence (Zustand)
- **`useBookingStore`:** Manages reservation additions, cancellations, simulated door check-ins, and conflict validation.
- **AsyncStorage Persistence:** Uses `@react-native-async-storage/async-storage` via Zustand `persist` middleware so bookings persist across app reboots and offline sessions.
- **`useUserStore` & `useFilterStore`:** Manages VKU student profile sessions and search/filter parameters.

### 4. 🔔 Local Notification Reminders
- Integrates `expo-notifications` to schedule a check-in alert **15 minutes before the booked slot start time**.
- Allows students to test 5-second sample notification alerts directly from the profile settings screen.

### 5. 🎟️ Interactive QR Check-In Booking Pass
- Generates a unique secure QR code payload using `react-native-qrcode-svg`.
- Allows students to present their digital pass or simulate a door scanner check-in to validate occupancy.

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) or Yarn
- [Expo Go App](https://expo.dev/go) installed on iOS or Android physical device (for device testing)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vku-student/study-room-booking-app.git
   cd study-room-booking-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check TypeScript types:**
   ```bash
   npm run ts:check
   ```

---

## 💻 Running the Application

### Option A: Expo Web Preview (Instant Browser Demo)
Run the app in your browser:
```bash
npm run web
```
or
```bash
npx expo start --web
```

### Option B: Mobile Device via Expo Go
1. Start the Expo development server:
   ```bash
   npm start
   ```
2. Scan the generated QR code using:
   - **Android:** Expo Go app.
   - **iOS:** Stock Camera app (opens Expo Go).

---

## 📦 Building Android APK (Smartphone Download)

To build a standalone **Android APK** for physical smartphone installation:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Log in to your Expo account:**
   ```bash
   eas login
   ```

3. **Configure & Trigger Preview APK Build:**
   ```bash
   eas build --platform android --profile preview
   ```

4. Once the build completes on EAS, download the `.apk` file directly to your smartphone or distribute the download link to users.

---

## 📁 Project Directory Structure

```
StudyRoomBookingApp/
├── App.tsx                      # Root navigation shell & tab bar
├── app.json                     # Expo SDK configuration & plugins
├── babel.config.js              # Babel Expo preset
├── eas.json                     # EAS Build configuration for APKs
├── index.js                     # Expo root entrypoint
├── package.json                 # Dependencies & build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── docs/
│   └── Technical_Report.md      # 2-4 Page Technical Project Report
└── src/
    ├── components/              # Modular UI Components
    │   ├── FilterBar.tsx        # Search, building, capacity, equipment chips
    │   ├── Header.tsx           # VKU brand header & student badge
    │   ├── QRTicketModal.tsx    # Interactive SVG QR booking pass modal
    │   ├── RoomCard.tsx         # Memoized 60fps room item card
    │   └── SlotPicker.tsx       # 7-day date selector & conflict slot grid
    ├── data/
    │   └── mockRooms.ts         # VKU campus room dataset & 2-hour time slots
    ├── screens/                 # Core Screen Views
    │   ├── HomeScreen.tsx       # Room discovery & 60fps FlatList feed
    │   ├── MyBookingsScreen.tsx # Reservations manager & history
    │   ├── ProfileScreen.tsx    # VKU Student ID card & notification test
    │   └── RoomDetailScreen.tsx # Room details & slot picker engine
    ├── store/                   # Zustand Stores
    │   ├── useBookingStore.ts   # Reservation state, conflict logic, storage
    │   ├── useFilterStore.ts    # Search query & filter state
    │   └── useUserStore.ts      # VKU student session state
    ├── types/
    │   └── index.ts             # TypeScript data models
    └── utils/
        └── notifications.ts     # Expo notifications scheduling helper
```

---

## 📄 Submission Package Deliverables

1. 🌐 **Live Demo / Expo Go QR Link:** Available via `npx expo start` or hosted web preview.
2. 💻 **GitHub Repository:** Complete TypeScript source code and documentation.
3. 📄 **Technical Report:** Detailed technical design report located at [`docs/Technical_Report.md`](file:///d:/Code/StudyRoomBookingApp/docs/Technical_Report.md).
