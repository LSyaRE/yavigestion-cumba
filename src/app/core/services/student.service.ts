import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student, StudentFilter } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  getAll(filter?: StudentFilter): Observable<Student[]> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<Student[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  getByCareer(careerId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/career/${careerId}`);
  }

  getBySubjectType(subjectType: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/subject-type/${subjectType}`);
  }

  assignTutor(studentId: number, tutorId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${studentId}/assign-tutor`, { tutorId });
  }

  getMyStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/my-students`);
  }

  bulkCreate(students: any[]) {
  return this.http.post(`${this.apiUrl}/students/bulk`, students);
}
}