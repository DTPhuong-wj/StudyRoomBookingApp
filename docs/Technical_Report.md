# 📄 Technical Report: Real-time Study Room Booking App
**Course / Assignment:** Mini-Project 2 - Mobile Application Development  
**Institution:** Vietnam - Korea University of Information and Communication Technology (VKU)  
**Author:** Student Development Team  
**Date:** September 17, 2026  

---

## 1. Executive Summary & Problem Scenario

Students and study groups at VKU (Vietnam - Korea University) frequently face challenges finding available computer labs and study spaces across campus buildings (Buildings A, B, C, and V). Physical room checks waste study time and often result in group booking collisions or double-booked facilities.

This project delivers a **mobile-first React Native & Expo application** engineered for real-time room discovery, 2-hour discrete slot conflict prevention, local push notification check-in alerts, and interactive QR booking passes.

---

## 2. System Architecture & Tech Stack

The application adheres to a modular, layered React Native architecture:

```
┌────────────────────────────────────────────────────────┐
│               React Native & Expo UI Layer            │
│  (HomeScreen, RoomDetailScreen, MyBookings, Profile)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│              Global State Layer (Zustand)              │
│      useBookingStore • useFilterStore • useUserStore   │
└──────────────┬────────────────────────────┬────────────┘
               │                            │
┌──────────────▼────────────┐  ┌────────────▼────────────┐
│ Offline Storage Engine    │  │ Local Notifications    │
│ AsyncStorage Persistence  │  │ expo-notifications     │
└───────────────────────────┘  └─────────────────────────┘
```

### Key Technical Stack Components:
- **Framework:** React Native (Expo SDK 52) with TypeScript
- **State Management:** Zustand with `persist` middleware backed by `@react-native-async-storage/async-storage`
- **Component Rendering:** React Native `FlatList` with `React.memo` performance optimizations
- **Notifications:** `expo-notifications` for 15-minute pre-slot reminder scheduling
- **QR Code Generation:** `react-native-qrcode-svg` for interactive door check-in passes

---

## 3. Global State Management (Zustand & AsyncStorage)

Traditional React state management with context providers can introduce unnecessary re-render cascades across non-adjacent components. Zustand was selected for its minimal boilerplate, atomic selectors, and built-in middleware support.

### State Store Structure (`useBookingStore.ts`)
```typescript
interface BookingStoreState {
  reservations: Reservation[];
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  addReservation: (params: {...}) => Promise<{ success: boolean; reservation?: Reservation }>;
  cancelReservation: (id: string) => Promise<void>;
  checkInReservation: (id: string) => void;
}
```

### Persistence Logic
The store automatically synchronizes with `AsyncStorage` on every state mutation using JSON serialization:
```typescript
export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'vku-study-room-bookings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

---

## 4. 60 FPS FlatList List Rendering Optimizations

Rendering large feeds of room items containing images, equipment badges, and status indicators can cause frame drops during fast scrolling. The following 5 optimization techniques were implemented in `HomeScreen.tsx` and `RoomCard.tsx`:

1. **Component Memoization (`React.memo`):**
   `RoomCard` is wrapped in `React.memo` with custom prop comparison logic (`prevProps.room.id === nextProps.room.id`) to prevent re-rendering unchanged cards when filters update.

2. **Fixed Item Layout (`getItemLayout`):**
   Providing explicit height offsets eliminates the need for dynamic height calculations on the native thread during scroll events:
   ```typescript
   getItemLayout={(_, index) => ({ length: 290, offset: 290 * index, index })}
   ```

3. **Clipped Subviews Removal (`removeClippedSubviews`):**
   Unmounts off-screen components outside the active viewport to reduce memory footprint.

4. **Batch Rendering Boundaries (`maxToRenderPerBatch`, `windowSize`):**
   Configured `windowSize={5}` and `maxToRenderPerBatch={5}` to balance initial load speed and scroll responsiveness.

5. **Memoized Event Handlers (`useCallback`):**
   Navigation callback references are preserved across render cycles.

---

## 5. Real-Time Time-Slot Conflict Prevention Engine

To ensure double-bookings are strictly impossible, the app enforces a real-time conflict checking algorithm prior to reservation commit:

### 2-Hour Discrete Slots
Rooms are allocated in 6 standardized 2-hour blocks per day:
- `Slot 1:` 07:30 – 09:30
- `Slot 2:` 09:30 – 11:30
- `Slot 3:` 13:00 – 15:00
- `Slot 4:` 15:00 – 17:00
- `Slot 5:` 17:30 – 19:30
- `Slot 6:` 19:30 – 21:30

### Conflict Engine Algorithm (`isSlotBooked`)
```typescript
isSlotBooked: (roomId: string, date: string, slotId: string) => {
  const { reservations } = get();
  return reservations.some(
    (res) =>
      res.roomId === roomId &&
      res.date === date &&
      res.slotId === slotId &&
      res.status !== 'cancelled'
  );
}
```
When a student selects a room and date in `SlotPicker.tsx`, the component queries `isSlotBooked` for every slot. If `isSlotBooked` returns `true`, the corresponding slot card is dynamically rendered in a disabled state with an `OCCUPIED` badge.

---

## 6. Local Notifications & Interactive QR Passes

### Check-In Reminders (`expo-notifications`)
When a booking is confirmed, `scheduleCheckInNotification` calculates the epoch timestamp 15 minutes before slot commencement:
```typescript
const triggerTime = new Date(slotStartDateTime.getTime() - 15 * 60 * 1000);
```
A local push notification is scheduled on the mobile device alerting the student to scan their pass at the room door.

### Digital QR Pass Generation (`QRTicketModal.tsx`)
Each reservation generates a cryptographically unique QR payload encoding:
- `bookingId`
- `roomId` & `roomName`
- `studentId` & `groupName`
- `date` & `slotLabel`
- `timestamp`

Students present the SVG QR code at room entry to validate check-in status.

---

## 7. Verification & Quality Assurance

- **Type Safety:** Verified using `npm run ts:check` (`tsc --noEmit`) with 0 errors.
- **State Persistence:** Verified by creating reservations, closing the application process, and verifying that state restored seamlessly from AsyncStorage.
- **Conflict Prevention:** Verified that creating a booking for Room A1.101 on a given slot disables that slot instantly for all future booking attempts.
- **Cross-Platform Compatibility:** Tested on Web (`npm run web`) and native Android/iOS viewports via Expo.

---

## 8. Conclusion

The VKU Real-time Study Room Booking App successfully fulfills all requirements of Mini-Project 2, providing VKU students with a performant, visually impressive, and collision-free study room reservation tool.
