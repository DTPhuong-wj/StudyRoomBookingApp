import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VKUUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  studentId?: string;
  role: 'STUDENT' | 'FACULTY';
  department: string;
}

interface AuthState {
  user: VKUUser | null;
  isAuthenticated: boolean;
  loginError: string | null;
  
  // Auth methods
  loginWithGoogleEmail: (email: string, name?: string, picture?: string) => { success: boolean; message?: string };
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'vku-21it001',
        email: 'annv.21it@vku.udn.vn',
        name: 'Nguyen Van An',
        studentId: '21IT001',
        role: 'STUDENT',
        department: 'Faculty of Computer Science',
      },
      isAuthenticated: true,
      loginError: null,

      loginWithGoogleEmail: (email: string, name?: string, picture?: string) => {
        const cleanEmail = email.trim().toLowerCase();

        // STRICT VKU DOMAIN VALIDATION GATE (@vku.udn.vn)
        if (!cleanEmail.endsWith('@vku.udn.vn')) {
          const errorMsg = `Access Restricted: Account "${email}" is not authorized. Only official VKU University emails (@vku.udn.vn) can sign in!`;
          set({ loginError: errorMsg });
          return { success: false, message: errorMsg };
        }

        // Determine Student vs Faculty based on email prefix/ID pattern
        const isFaculty = cleanEmail.includes('faculty') || cleanEmail.includes('teacher') || cleanEmail.includes('gv');
        const extractedId = cleanEmail.split('@')[0].toUpperCase();

        const vkuUser: VKUUser = {
          id: `vku-${Date.now()}`,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          picture,
          studentId: isFaculty ? undefined : extractedId,
          role: isFaculty ? 'FACULTY' : 'STUDENT',
          department: isFaculty ? 'Faculty of Information Technology' : 'Faculty of Computer Science',
        };

        set({
          user: vkuUser,
          isAuthenticated: true,
          loginError: null,
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          loginError: null,
        });
      },

      clearError: () => set({ loginError: null }),
    }),
    {
      name: 'vku-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
