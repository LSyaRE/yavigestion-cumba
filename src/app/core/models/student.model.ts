import { User } from './user.model';
import { Career } from './career.model';
import { AcademicPeriod } from './academic-period.model';
import { Enterprise } from './enterprise.model';

export interface Student extends User {
  career?: Career;
  enrolledSubjects?: StudentSubject[];
  tutor?: User;
  isMatriculatedInSIGA: boolean;
}

export interface StudentSubject {
  id: number;
  type: SubjectType;
  student: Student;
  academicPeriod: AcademicPeriod;
  tutor?: User;
  enterprise?: Enterprise;
  status: string;
  period?: AcademicPeriod;  
}

export enum SubjectType {
  VINCULATION = 'VINCULATION',
  DUAL_INTERNSHIP = 'DUAL_INTERNSHIP',
  PREPROFESSIONAL_INTERNSHIP = 'PREPROFESSIONAL_INTERNSHIP'
}
