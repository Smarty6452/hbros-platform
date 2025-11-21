// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Poster' | 'Viewer';
}

interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string) => boolean; // now returns success
  logout: () => void;
  isAuthenticated: () => boolean;
  isPoster: () => boolean;
  isViewer: () => boolean;
}

// This handles ALL possible .NET JWT claim names
const decodeToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);

    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded['role'] ||
      decoded['Role'] ||
      decoded['roles'] ||
      'Viewer';

    const name =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      decoded['unique_name'] ||
      decoded['name'] ||
      'User';

    const email =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      decoded['email'] ||
      '';

    const id =
      decoded['http://schemas.xmlsoap.org/ws/2005/identity/claims/nameidentifier'] ||
      decoded['sub'] ||
      decoded['nameid'] ||
      '';

    if (!['Poster', 'Viewer'].includes(role)) {
      console.warn('Invalid role:', role);
      return null;
    }

    return { id, name, email, role: role as 'Poster' | 'Viewer' };
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: (token: string) => {
        const user = decodeToken(token);
        if (!user) {
          return false;
        }

        localStorage.setItem('token', token);
        set({ token, user });
        return true;
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token && !!get().user,
      isPoster: () => get().user?.role === 'Poster',
      isViewer: () => get().user?.role === 'Viewer',
    }),
    {
      name: 'handybros-auth',
    }
  )
);