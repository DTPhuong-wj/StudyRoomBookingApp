export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment = 
  | 'Projector' 
  | 'Whiteboard' 
  | 'High-spec PC' 
  | 'AC' 
  | 'Smart Screen' 
  | 'Sound System';

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  photoUrl: string;
  description: string;
  isAvailableNow: boolean;
}

export type ReservationStatus = 'active' | 'checked-in' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  studentId: string;
  studentName: string;
  groupName: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotLabel: string;
  createdAt: string;
  status: ReservationStatus;
  qrHash: string;
  notificationId?: string;
}

export interface UserSession {
  studentId: string;
  fullName: string;
  email: string;
  department: string;
  major: string;
}

export interface FilterState {
  searchQuery: string;
  selectedBuilding: Building | 'ALL';
  capacityRange: 'ALL' | 'SMALL' | 'MEDIUM' | 'LARGE'; // SMALL: 2-4, MEDIUM: 5-10, LARGE: >10
  selectedEquipment: Equipment[];
}
