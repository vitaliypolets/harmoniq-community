// frontend\src\features\auth\session\session.types.ts

import type { User } from '@/types/user';

export type SessionResponse = {
  data: {
    accessToken: string;
  };
  message: string;
};

export type CurrentUserResponse = {
  success: boolean;
  data: User;
};
