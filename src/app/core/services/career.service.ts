import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Career, GenericResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/careers`;

  getAll(): Observable<Career[]> {
    return this.http.get<Career[]>(this.apiUrl);
  }

  getById(id: number): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrl}/${id}`);
  }

  create(career: Career): Observable<GenericResponse<Career>> {
    return this.http.post<GenericResponse<Career>>(this.apiUrl, career);
  }

  update(id: number, career: Career): Observable<GenericResponse<Career>> {
    return this.http.put<GenericResponse<Career>>(`${this.apiUrl}/${id}`, career);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCoordinator(): Observable<Career[]> {
    return this.http.get<Career[]>(`${this.apiUrl}/my-careers`);
  }
}
