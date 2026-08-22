// frontend/src/features/auth/session/session.service.ts

import { api } from "@/lib/api/client";
import type { CurrentUserResponse, SessionResponse } from "./session.types";

export async function restoreSession(): Promise<{
  user: CurrentUserResponse["data"];
  accessToken: string;
}> {
  const sessionResponse = await api.post<SessionResponse>("/auth/session");

  const accessToken = sessionResponse.data.data.accessToken;

  const userResponse = await api.get<CurrentUserResponse>("/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    user: userResponse.data.data,
    accessToken,
  };
}

export async function logout(): Promise<void> {
  await api.delete("/auth/session");
}
