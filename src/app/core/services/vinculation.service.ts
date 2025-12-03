import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vinculation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VinculationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vinculation`;

  getAll(): Observable<Vinculation[]> {
    return this.http.get<Vinculation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Vinculation> {
    return this.http.get<Vinculation>(`${this.apiUrl}/${id}`);
  }

  create(vinculation: Vinculation): Observable<Vinculation> {
    return this.http.post<Vinculation>(this.apiUrl, vinculation);
  }

  update(vinculation: Vinculation): Observable<Vinculation> {
    return this.http.put<Vinculation>(this.apiUrl, vinculation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
