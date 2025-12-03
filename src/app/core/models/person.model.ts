export interface Person {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phonenumber: string;
  address: string;
  bloodtype: BloodType;
  gender: string;
  birthdate: Date;
  status: string;
}

export enum BloodType {
  O_NEGATIVE = 'O-',
  O_POSITIVE = 'O+',
  A_NEGATIVE = 'A-',
  A_POSITIVE = 'A+',
  B_NEGATIVE = 'B-',
  B_POSITIVE = 'B+',
  AB_NEGATIVE = 'AB-',
  AB_POSITIVE = 'AB+'
}