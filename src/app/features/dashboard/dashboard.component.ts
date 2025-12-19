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
  background: #f3f4f6;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.dashboard-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 1000px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.dashboard-content h1 {
  font-size: 30px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.dashboard-content p {
  color: #6b7280;
  margin-bottom: 32px;
  font-size: 16px;
}

/* ================= ROLES ================= */

.role-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.role-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.role-card:hover {
  transform: translateY(-6px);
  border-color: #3b82f6;
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.18);
}

.role-card .icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  margin: 0 auto 16px;
}

.role-card h3 {
  font-size: 18px;
  color: #1f2937;
  margin-bottom: 6px;
  font-weight: 600;
}

.role-card p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* ================= BOTÓN ================= */

.btn {
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary {
  background: #ef4444;
  color: white;
}

.btn-secondary:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* ================= RESPONSIVE ================= */

@media (max-width: 768px) {
  .dashboard-content {
    padding: 28px 20px;
  }

  .dashboard-content h1 {
    font-size: 24px;
  }

  .role-cards {
    grid-template-columns: 1fr;
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