import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AcademicPeriod, GenericResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/periods`;

  getAll(): Observable<AcademicPeriod[]> {
    return this.http.get<AcademicPeriod[]>(this.apiUrl);
  }

  getById(id: number): Observable<AcademicPeriod> {
    return this.http.get<AcademicPeriod>(`${this.apiUrl}/${id}`);
  }

  create(period: AcademicPeriod): Observable<GenericResponse<AcademicPeriod>> {
    return this.http.post<GenericResponse<AcademicPeriod>>(this.apiUrl, period);
  }

  update(id: number, period: AcademicPeriod): Observable<GenericResponse<AcademicPeriod>> {
    return this.http.put<GenericResponse<AcademicPeriod>>(`${this.apiUrl}/${id}`, period);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCareers(periodId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${periodId}/careers`);
  }
}
