import { create } from "zustand";
import type { User } from "@/types/user";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  isInitialized: boolean;

  setSession: (user: User, accessToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  clearSession: () => void;
  setRefreshing: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isRefreshing: false,
  isInitialized: false,

  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            ...updatedUser,
          }
        : null,
    })),

  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),

  setRefreshing: (isRefreshing) =>
    set({
      isRefreshing,
    }),

  setInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),
}));
