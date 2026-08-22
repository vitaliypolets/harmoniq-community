import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

import { useAuthStore } from '@/store/auth.store';

type SessionRefreshResponse = {
  data: {
    accessToken: string;
  };
  message?: string;
};

type RetryableAxiosConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

//Окремий axios instance для refresh

const refreshApi = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

//спільний refresh promise

let refreshPromise: Promise<string> | null = null;

function shouldSkipRefresh(url?: string): boolean {
  if (!url) {
    return false;
  }

  return (
    url.includes('/auth/session') ||
    url.includes('/auth/login') ||
    url.includes('/auth/register')
  );
}

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response =
        await refreshApi.post<SessionRefreshResponse>('/auth/session');

      const newAccessToken = response.data.data.accessToken;

     //User уже знаходиться в Zustand,оновлюю тільки accessToken
     
     useAuthStore.setState({
        accessToken: newAccessToken,
      });

      return newAccessToken;
    } catch (error) {

      //Refresh token/session більше не валідні. 
      // Локальну auth session очищаємо
      //AuthGuard/GuestGuard реагують на зміну isAuthenticated
   
      useAuthStore.getState().clearSession();

      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// додаємо актуальний accessToken із Zustand

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  return config;
});

// якщо request повернув 401, то робимо refresh session і повторюємо request з новим accessToken   

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | RetryableAxiosConfig
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers.set(
        'Authorization',
        `Bearer ${newAccessToken}`,
      );

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);

    this.name = 'ApiError';
  }
}

async function executeFetch<T>(
  path: string,
  init: RequestInit,
  allowRefresh: boolean,
): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken;

  const response = await fetch(`/api${path}`, {
    ...init,

    credentials: 'include',

    headers: {
      ...(init.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),

      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),

      ...init.headers,
    },
  });

  //Для fetch helper також підтримуємо automatic refresh, якщо отримали 401 Unauthorized
 
  if (
    response.status === 401 &&
    allowRefresh &&
    !shouldSkipRefresh(path)
  ) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retryResponse = await fetch(`/api${path}`, {
        ...init,

        credentials: 'include',

        headers: {
          ...(init.body instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' }),

          Authorization: `Bearer ${newAccessToken}`,

          ...init.headers,
        },
      });

      if (retryResponse.status === 204) {
        return undefined as T;
      }

      const retryPayload = await retryResponse
        .json()
        .catch(() => null);

      if (!retryResponse.ok) {
        throw new ApiError(
          retryResponse.status,
          retryPayload?.message ?? 'Request failed',
          retryPayload?.details,
        );
      }

      return retryPayload as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw error;
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message ?? 'Request failed',
      payload?.details,
    );
  }

  return payload as T;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  return executeFetch<T>(
    path,
    init,
    true,
  );
}
