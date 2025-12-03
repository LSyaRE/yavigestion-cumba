import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthRequest, AuthResponse, GenericResponse, GenericOnlyTextResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = this.getToken();
    if (token) {
      // Aquí podrías decodificar el token y cargar el usuario
    }
  }

  login(credentials: AuthRequest): Observable<GenericResponse<AuthResponse>> {
    return this.http.post<GenericResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data?.token) {
            this.setToken(response.data.token);
          }
        })
      );
  }

  register(credentials: AuthRequest): Observable<GenericOnlyTextResponse> {
    return this.http.post<GenericOnlyTextResponse>(`${this.apiUrl}/register`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(role => role.name === roleName) || false;
  }

  hasPermission(permissionName: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(role => 
      role.permissions?.some(p => p.name === permissionName)
    ) || false;
  }
}