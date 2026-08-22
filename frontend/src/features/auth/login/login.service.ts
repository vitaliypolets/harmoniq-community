// frontend\src\features\auth\login\login.service.ts

import { api } from '@/lib/api/client';
import type { LoginFormValues } from './login.types';
import type { User } from '@/types/user';

type LoginResponse = {
  data: {
    user: User;
    accessToken: string;
  };
  message: string;
};

export async function login(values: LoginFormValues) {
  const response = await api.post<LoginResponse>('/auth/login', values);

  return response.data.data;
}
