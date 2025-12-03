import { Career } from './career.model';

export interface AcademicPeriod {
  id: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  careers?: Career[];
  status: string;
}