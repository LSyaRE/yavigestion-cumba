import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AcademicPeriod, Career, GenericOnlyTextResponse, GenericResponse, PaginatedResponse } from '../models';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private periods: AcademicPeriod[] = [];
  private careers: Career[] = [];
  private apiUrl = `${environment.apiUrl}/periods`;

  private periods$ = new BehaviorSubject<AcademicPeriod[]>([]);

  constructor(private http: HttpClient) {}

  // ================= PERIODOS =================
  getAll(): Observable<AcademicPeriod[]> {
    return this.http.get<PaginatedResponse<AcademicPeriod[]>>(this.apiUrl).pipe(map(listPeriod => listPeriod.data));
  }

  getById(id: number): Observable<AcademicPeriod> {
    return this.http.get<GenericResponse<AcademicPeriod>>(`${this.apiUrl}/${id}`).pipe(map(listPeriod => listPeriod.data));
  }

  create(period: Partial<AcademicPeriod>): Observable<GenericOnlyTextResponse> {
    return this.http.post<GenericOnlyTextResponse>(`${this.apiUrl}`, period);
  }

  update(id: number, period: AcademicPeriod): Observable<GenericOnlyTextResponse> {
      return this.http.put<GenericOnlyTextResponse>(`${this.apiUrl}/${id}`, period);
  }

  delete(id: number): Observable<GenericOnlyTextResponse> {
    return this.http.delete<GenericOnlyTextResponse>(`${this.apiUrl}/${id}`);
  }

  // ================= CARRERAS =================
  getCareers(periodId: number): Observable<Career[]> {
    
    return new Observable<Career[]>();
  }

}
