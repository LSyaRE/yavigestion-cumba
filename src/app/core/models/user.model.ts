import { Role } from './role.model';
import { Person } from './person.model';

export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  createdAt?: Date;
  roles?: Role[];
  person?: Person;
  status: string;
}