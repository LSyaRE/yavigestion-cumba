import { Career } from './career.model';

export interface CareerPeriod {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  totalCareers: number;
  careers: Career[];
  totalTraditional: number;
  totalActiveCareers: number;
  totalDual: number;
}
