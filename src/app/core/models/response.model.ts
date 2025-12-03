export interface GenericResponse<T> {
  message?: string;
  status: number;
  data?: T;
}

export interface GenericOnlyTextResponse {
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
