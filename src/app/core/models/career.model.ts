import { AcademicPeriod } from './academic-period.model';

export interface Career {
  id: number;
  name: string;
  description?: string;
  academicPeriods?: AcademicPeriod[];
  status: string;
  isDual?: boolean;
}