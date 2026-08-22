export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  articlesAmount: number;
};

export type PublicUser = Omit<User, 'email'>;
