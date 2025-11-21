// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {jwtDecode} from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Poster' | 'Viewer';
}

interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isPoster: () => boolean;
  isViewer: () => boolean;
}

const decodeToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);

    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                 decoded.role ||
                 'Viewer';

    const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                 decoded.name ||
                 'User';

    const email = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                  decoded.email ||
                  '';

    const id = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
               decoded.sub ||
               '';

    if (!['Poster', 'Viewer'].includes(role)) return null;

    return { id, name, email, role: role as 'Poster' | 'Viewer' };
  } catch (err) {
    console.error('Invalid token', err);
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
        if (user) {
          localStorage.setItem('token', token); // backup
          set({ token, user });
        }
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
      onRehydrateStorage: () => (state) => {
        const token = localStorage.getItem('token');
        if (token && state) {
          const user = decodeToken(token);
          if (user) {
            state.user = user;
            state.token = token;
          } else {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
          }
        }
      },
    }
  )
);