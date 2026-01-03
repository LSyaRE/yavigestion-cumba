export interface GenericResponse<T> {
  message?: string;
  status: number;
  data: T;
}

export interface GenericOnlyTextResponse {
  message: string;
  status: number;
}

export interface PaginatedResponse<T> {
  message: string;
  status: number;
  data: T;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
}
