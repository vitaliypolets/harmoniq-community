import type { User } from '@/types/user';

export type UploadPhotoFormValues = {
  avatar: File | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  avatar?: File | null;
};

export type RegisterResponse = {
  user: User;
  accessToken: string;
};
