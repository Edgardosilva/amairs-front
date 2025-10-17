import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'usuario' | 'admin';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isAdmin: false,

        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              isAdmin: user?.rol === 'admin'
            },
            false,
            'setUser'
          ),

        logout: async () => {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            await fetch(`${API_URL}/users/logout`, {
              method: 'POST',
              credentials: 'include'
            });
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          } finally {
            set(
              {
                user: null,
                isAuthenticated: false,
                isAdmin: false
              },
              false,
              'logout'
            );
          }
        },

        checkAuth: async () => {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/users/current`, {
              credentials: 'include'
            });

            if (response.ok) {
              const data = await response.json();
              if (data.authenticated && data.user) {
                set(
                  {
                    user: data.user as User,
                    isAuthenticated: true,
                    isAdmin: data.user.rol === 'admin'
                  },
                  false,
                  'checkAuth'
                );
              } else {
                set(
                  {
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false
                  },
                  false,
                  'checkAuth/notAuthenticated'
                );
              }
            }
          } catch (error) {
            console.error('Error checking auth:', error);
            set(
              {
                user: null,
                isAuthenticated: false,
                isAdmin: false
              },
              false,
              'checkAuth/error'
            );
          }
        }
      }),
      {
        name: 'auth-storage'
      }
    )
  )
);
