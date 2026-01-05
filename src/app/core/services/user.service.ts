import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GenericOnlyTextResponse, GenericResponse, PaginatedResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<PaginatedResponse<User[]>>(this.apiUrl).pipe(map(users => users.data));
  }

  getById(id: number): Observable<User> {
   return this.http.get<GenericResponse<User>>(`${this.apiUrl}/${id}`).pipe(map(user => user.data));
  }

  getTutors(): Observable<User[]> {
    return this.http.get<PaginatedResponse<User[]>>(`${this.apiUrl}/tutors`).pipe(map(users => users.data));
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: number): Observable<GenericOnlyTextResponse> {
    return this.http.delete<GenericOnlyTextResponse>(`${this.apiUrl}/${id}`);
  }
}