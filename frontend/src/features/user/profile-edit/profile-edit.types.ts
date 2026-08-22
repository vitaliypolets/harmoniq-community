export type UpdateMeRequest = FormData;

export type UpdateMeResponse = {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    articlesAmount: number;
  };
};

export type ProfileEditFormValues = {
  name: string;
  avatar?: File | null;
};
