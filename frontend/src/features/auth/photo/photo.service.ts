import { api } from '@/lib/api/client';
import type { RegisterPayload, RegisterResponse } from './photo.types';

type RegisterApiResponse = {
  data: RegisterResponse;
  message: string;
};

export async function registerUser(payload: RegisterPayload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  formData.append('password', payload.password);

  if (payload.avatar) {
    formData.append('avatar', payload.avatar);
  }

  const response = await api.post<RegisterApiResponse>('/auth/register', formData);

  return response.data.data;
}
