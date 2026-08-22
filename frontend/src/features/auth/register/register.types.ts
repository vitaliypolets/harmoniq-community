export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterDraft = Pick<RegisterFormValues, "name" | "email">;
