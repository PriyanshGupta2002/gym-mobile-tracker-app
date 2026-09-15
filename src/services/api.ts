import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_BASE_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_BASE_API_URL is not configured.");
}

const ACCESS_TOKEN_KEY = "gym_app_access_token";
const REFRESH_TOKEN_KEY = "gym_app_refresh_token";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Get a new access token using the refresh token.
 */
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    return null;
  }

  try {
    // IMPORTANT:
    // Use raw axios here, NOT `api`.
    // Otherwise this request would also go through
    // the response interceptor.
    const response = await axios.post(
      `${API_URL}/auth/refresh`,
      {
        refresh_token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const { access_token, refresh_token } = response.data;

    if (!access_token || !refresh_token) {
      throw new Error("Invalid refresh response.");
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);

    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);

    return access_token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

    return null;
  }
};

/**
 * Request interceptor
 *
 * Attach the latest access token to every request.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor
 *
 * 401 → refresh → retry original request
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(
        new Error("Something went wrong. Please try again."),
      );
    }

    const requestUrl = originalRequest.url ?? "";

    /**
     * Never attempt token refresh for authentication endpoints.
     */
    const isAuthRequest =
      requestUrl.includes("/auth/send-otp") ||
      requestUrl.includes("/auth/verify-otp") ||
      requestUrl.includes("/auth/refresh");

    /**
     * Access token expired.
     */
    if (status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      /**
       * Only one refresh request at a time.
       */
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshAccessToken().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      /**
       * Refresh failed.
       */
      if (!newAccessToken) {
        const data = error.response?.data;

        let message = "Your session has expired. Please log in again.";

        if (
          data &&
          typeof data === "object" &&
          "detail" in data &&
          data.detail
        ) {
          message = String(data.detail);
        }

        return Promise.reject(new Error(message));
      }

      /**
       * Retry original request with new token.
       */
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return api(originalRequest);
    }

    /**
     * Normal API error.
     */
    const data = error.response?.data;

    let message = "Something went wrong. Please try again.";

    if (data && typeof data === "object") {
      if ("detail" in data && data.detail) {
        message = String(data.detail);
      } else if ("message" in data && data.message) {
        message = String(data.message);
      }
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  },
);
