export type ApiResponse<T> = {
  data: T;
  message: string;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  meta: PaginationMeta;
}>;

export type ApiErrorPayload = {
  status: number;
  message: string;
  details?: unknown;
};
