import { SubjectType } from './student.model';

export interface StudentFilter {
  careerId?: number;
  periodId?: number;
  subjectType?: SubjectType;
  status?: string;
  searchTerm?: string;
  isMatriculatedInSIGA?: boolean;
}

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}
