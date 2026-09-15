import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type UserRole = "member" | "owner" | "staff";

export type User = {
  id: string;
  name: string | null;
  phone: string;
  role: UserRole;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    user: User,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;

  logout: () => Promise<void>;

  restoreSession: () => Promise<void>;
};

export const USER_KEY = "gym_app_user";
export const ACCESS_TOKEN_KEY = "gym_app_access_token";
export const REFRESH_TOKEN_KEY = "gym_app_refresh_token";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * ---------------------------------------------------------
   * LOGIN
   * ---------------------------------------------------------
   */
  login: async (user, accessToken, refreshToken) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  /**
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */
  logout: async () => {
    await SecureStore.deleteItemAsync(USER_KEY);

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);

    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * ---------------------------------------------------------
   * RESTORE SESSION
   * ---------------------------------------------------------
   */
  restoreSession: async () => {
    try {
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      /**
       * We need at least the user and refresh token
       * to consider this a restorable session.
       *
       * The access token may have expired.
       */
      if (!storedUser || !refreshToken) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        return;
      }

      const user: User = JSON.parse(storedUser);

      /**
       * If access token exists, use the session.
       *
       * If it has expired, Axios will automatically
       * refresh it when the first API request gets 401.
       */
      if (accessToken) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        return;
      }

      /**
       * No access token but refresh token exists.
       *
       * We can still consider the session restorable.
       * The API layer will obtain a fresh access token.
       */
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to restore session:", error);

      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
