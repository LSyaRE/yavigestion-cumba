import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-content">
        <h1>Bienvenido al Sistema de Gestión Yavirac</h1>
        <p>Selecciona tu perfil para continuar:</p>
        
        <div class="role-cards">
          <div class="role-card" (click)="navigate('/admin/dashboard')">
            <div class="icon"></div>
            <h3>Administrador</h3>
            <p>Gestión completa del sistema</p>
          </div>

          <div class="role-card" (click)="navigate('/coordinator/dashboard')">
            <div class="icon"></div>
            <h3>Coordinador</h3>
            <p>Gestión de estudiantes</p>
          </div>

          <div class="role-card" (click)="navigate('/tutor/dashboard')">
            <div class="icon"></div>
            <h3>Tutor</h3>
            <p>Evaluación de estudiantes</p>
          </div>

          <div class="role-card" (click)="navigate('/student/dashboard')">
            <div class="icon"></div>
            <h3>Estudiante</h3>
            <p>Mis asignaturas</p>
          </div>
        </div>

        <button class="btn btn-secondary" (click)="logout()">
          Cerrar Sesión
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .dashboard-content {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 900px;
      width: 100%;
      text-align: center;
    }

    h1 {
      font-size: 28px;
      color: #1f2937;
      margin-bottom: 12px;
    }

    p {
      color: #6b7280;
      margin-bottom: 32px;
    }

    .role-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .role-card {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        border-color: #667eea;
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
      }

      .icon {
        font-size: 48px;
        margin-bottom: 12px;
      }

      h3 {
        font-size: 18px;
        color: #1f2937;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }
  `]
})
export class DashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}