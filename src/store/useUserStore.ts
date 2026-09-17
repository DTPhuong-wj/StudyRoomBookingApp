import { create } from 'zustand';
import { UserSession } from '../types';

interface UserStoreState {
  user: UserSession;
  setUser: (user: UserSession) => void;
  switchDemoUser: (index: number) => void;
}

const DEMO_USERS: UserSession[] = [
  {
    studentId: '21IT001',
    fullName: 'Nguyen Van An',
    email: 'annv.21it@vku.udn.vn',
    department: 'Faculty of Computer Science',
    major: 'Artificial Intelligence & Data Science',
  },
  {
    studentId: '22SE042',
    fullName: 'Tran Thi Mai',
    email: 'maitt.22se@vku.udn.vn',
    department: 'Faculty of Computer Engineering',
    major: 'Software Engineering',
  },
  {
    studentId: '23KR015',
    fullName: 'Le Hoang Nam',
    email: 'namlh.23kr@vku.udn.vn',
    department: 'Faculty of Digital Economy',
    major: 'E-Commerce & Digital Marketing',
  }
];

export const useUserStore = create<UserStoreState>((set) => ({
  user: DEMO_USERS[0],
  setUser: (user) => set({ user }),
  switchDemoUser: (index) => {
    if (DEMO_USERS[index]) {
      set({ user: DEMO_USERS[index] });
    }
  }
}));
