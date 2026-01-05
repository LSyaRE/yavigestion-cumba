import { AcademicPeriod } from './academic-period.model';

export interface Career {
  id: number;
  periodId: number;
  name: string;
  description?: string;
  academicPeriod?: AcademicPeriod; // singular
  status: string;
  isDual: string;
}