import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reservation, Room, TimeSlot } from '../types';
import { scheduleCheckInNotification, cancelNotification } from '../utils/notifications';

interface BookingStoreState {
  reservations: Reservation[];
  
  // Real-time conflict checking
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  
  // Booking actions
  addReservation: (params: {
    room: Room;
    slot: TimeSlot;
    date: string;
    studentId: string;
    studentName: string;
    groupName: string;
  }) => Promise<{ success: boolean; message?: string; reservation?: Reservation }>;
  
  cancelReservation: (id: string) => Promise<void>;
  checkInReservation: (id: string) => void;
  clearAllReservations: () => void;
}

// Initial mock reservations for demo realism
const INITIAL_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-vku-101',
    roomId: 'room-b102',
    roomName: 'B1.102 - Digital Library Quiet Study',
    building: 'B',
    floor: 1,
    studentId: '21IT001',
    studentName: 'Nguyen Van An',
    groupName: 'Algorithmic Research Group',
    date: new Date().toISOString().split('T')[0], // Today
    slotId: 'slot-2',
    slotLabel: '09:30 – 11:30',
    createdAt: new Date().toISOString(),
    status: 'active',
    qrHash: 'VKU-RES-B102-SLOT2-21IT001-SECUREHASH',
  },
  {
    id: 'res-vku-102',
    roomId: 'room-c208',
    roomName: 'C2.208 - Soft Skills & Pitching Lab',
    building: 'C',
    floor: 2,
    studentId: '22SE042',
    studentName: 'Tran Thi Mai',
    groupName: 'VKU Startup Innovation Club',
    date: new Date().toISOString().split('T')[0], // Today
    slotId: 'slot-3',
    slotLabel: '13:00 – 15:00',
    createdAt: new Date().toISOString(),
    status: 'active',
    qrHash: 'VKU-RES-C208-SLOT3-22SE042-SECUREHASH',
  },
];

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      reservations: INITIAL_MOCK_RESERVATIONS,

      isSlotBooked: (roomId: string, date: string, slotId: string) => {
        const { reservations } = get();
        return reservations.some(
          (res) =>
            res.roomId === roomId &&
            res.date === date &&
            res.slotId === slotId &&
            res.status !== 'cancelled'
        );
      },

      addReservation: async ({ room, slot, date, studentId, studentName, groupName }) => {
        const { isSlotBooked, reservations } = get();

        // 1. Conflict Prevention Engine
        if (isSlotBooked(room.id, date, slot.id)) {
          return {
            success: false,
            message: `Time slot ${slot.label} on ${date} for ${room.name} is already reserved by another group. Please choose another slot!`,
          };
        }

        // 2. Generate unique secure QR Hash
        const uniqueId = `res-vku-${Date.now()}`;
        const qrHash = JSON.stringify({
          bookingId: uniqueId,
          roomId: room.id,
          roomName: room.name,
          studentId,
          date,
          slotId: slot.id,
          timestamp: Date.now(),
        });

        // 3. Schedule Local Notification 15 minutes before slot start
        const notificationId = await scheduleCheckInNotification(
          room.name,
          date,
          slot.startTime,
          groupName
        );

        const newReservation: Reservation = {
          id: uniqueId,
          roomId: room.id,
          roomName: room.name,
          building: room.building,
          floor: room.floor,
          studentId,
          studentName,
          groupName,
          date,
          slotId: slot.id,
          slotLabel: slot.label,
          createdAt: new Date().toISOString(),
          status: 'active',
          qrHash,
          notificationId,
        };

        set({ reservations: [newReservation, ...reservations] });

        return {
          success: true,
          reservation: newReservation,
        };
      },

      cancelReservation: async (id: string) => {
        const { reservations } = get();
        const target = reservations.find((r) => r.id === id);

        if (target && target.notificationId) {
          await cancelNotification(target.notificationId);
        }

        set({
          reservations: reservations.map((r) =>
            r.id === id ? { ...r, status: 'cancelled' } : r
          ),
        });
      },

      checkInReservation: (id: string) => {
        const { reservations } = get();
        set({
          reservations: reservations.map((r) =>
            r.id === id ? { ...r, status: 'checked-in' } : r
          ),
        });
      },

      clearAllReservations: () => {
        set({ reservations: [] });
      },
    }),
    {
      name: 'vku-study-room-bookings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
