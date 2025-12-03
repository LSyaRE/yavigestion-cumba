import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evaluation, EvaluationTemplate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evaluations`;

  getTemplateByType(type: string): Observable<EvaluationTemplate> {
    return this.http.get<EvaluationTemplate>(`${this.apiUrl}/templates/${type}`);
  }

  create(evaluation: any): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.apiUrl, evaluation);
  }

  getByStudent(studentId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getByTutor(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/my-evaluations`);
  }

  update(id: number, evaluation: Evaluation): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, evaluation);
  }
}