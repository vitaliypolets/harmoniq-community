import { api } from '@/lib/api/client';

import type { CurrentUserResponse, UpdateMeRequest, UpdateMeResponse } from './me.types';

export async function getMe(): Promise<CurrentUserResponse['data']> {
  const response = await api.get<CurrentUserResponse>('/users/me');

  return response.data.data;
}

export async function updateMe(
  payload: UpdateMeRequest | FormData,
): Promise<UpdateMeResponse['data']> {
  const response = await api.patch<UpdateMeResponse>('/users/me', payload);

  return response.data.data;
}
