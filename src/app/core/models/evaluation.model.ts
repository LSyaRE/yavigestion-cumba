import { Student, SubjectType } from './student.model';
import { User } from './user.model';

export interface Evaluation {
  id: number;
  student: Student;
  tutor: User;
  subjectType: SubjectType;
  evaluationDate: Date;
  score?: number;
  comments?: string;
  template: EvaluationTemplate;
  status: string;
}

export interface EvaluationTemplate {
  id: number;
  name: string;
  type: SubjectType;
  fields: EvaluationField[];
}

export interface EvaluationField {
  id: number;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
}
