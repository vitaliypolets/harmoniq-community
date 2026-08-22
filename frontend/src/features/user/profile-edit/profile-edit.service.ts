import { api } from "@/lib/api/client";
import type { UpdateMeRequest, UpdateMeResponse } from "./profile-edit.types";

export async function updateMe(payload: UpdateMeRequest): Promise<UpdateMeResponse["data"]> {
  const response = await api.patch<UpdateMeResponse>("/users/me", payload);

  return response.data.data;
}
