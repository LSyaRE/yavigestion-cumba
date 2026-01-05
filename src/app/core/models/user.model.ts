import { Role } from './role.model';
import { Person } from './person.model';

export interface User {
  id: number;
  email: string;
  createdAt?: Date;
  password: string;
  roles?: Role[];
  person?: Person;
  status: string;
}