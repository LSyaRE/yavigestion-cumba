import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Career, GenericResponse, AcademicPeriod, GenericOnlyTextResponse, PaginatedResponse } from '../models';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareerService { 
  private apiUrl = `${environment.apiUrl}/careers`;
  

  private periods$ = new BehaviorSubject<AcademicPeriod[]>([]);

  constructor(private http: HttpClient) {}

  getAll(): Observable<Career[]> {
    return this.http.get<PaginatedResponse<Career[]>>(this.apiUrl).pipe(map(listPeriod => listPeriod.data));
  }

  getById(id: number): Observable<Career> {
        return this.http.get<GenericResponse<Career>>(`${this.apiUrl}/${id}`).pipe(map(listPeriod => listPeriod.data));
  }

  getPeriods(): Observable<AcademicPeriod[]> {
    return this.periods$.asObservable().pipe(delay(100));
  }

  create(career: Partial<Career>): Observable<GenericOnlyTextResponse> {
    return this.http.post<GenericOnlyTextResponse>(`${this.apiUrl}`, career);
  }

  update(id: number, career: Career): Observable<GenericOnlyTextResponse> {
    return this.http.put<GenericOnlyTextResponse>(`${this.apiUrl}/${id}`, career);
  }

  delete(id: number): Observable<GenericOnlyTextResponse> {
    return this.http.delete<GenericOnlyTextResponse>(`${this.apiUrl}/${id}`);
  }

  getByCoordinator(): Observable<Career[]> {
    return this.getAll();
  }
}
