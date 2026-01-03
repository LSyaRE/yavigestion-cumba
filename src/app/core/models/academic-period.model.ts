import { Career } from './career.model';

export interface AcademicPeriod {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  totalCareers: number;
  careers?: Career[];
  status: string;
}