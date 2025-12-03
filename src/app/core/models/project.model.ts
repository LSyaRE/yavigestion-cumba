import { Enterprise } from './enterprise.model';

export interface Project {
  id: number;
  name: string;
  address: string;
  executionTerm: string;
  startDate: Date;
  endDate: Date;
  finalReport?: string;
  enterprise: Enterprise;
  status: string;
}
