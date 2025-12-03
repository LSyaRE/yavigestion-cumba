import { Enterprise } from './enterprise.model';
import { User } from './user.model';

export interface Internship {
  id: number;
  name: string;
  description?: string;
  enterprise: Enterprise;
  startDate: Date;
  endDate: Date;
  users?: User[];
  status: string;
  type: InternshipType;
}

export enum InternshipType {
  DUAL = 'DUAL',
  PREPROFESSIONAL = 'PREPROFESSIONAL'
}