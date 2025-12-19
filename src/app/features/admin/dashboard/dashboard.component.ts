import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PeriodService } from '../../../core/services/period.service';
import { CareerService } from '../../../core/services/career.service';
import { UserService } from '../../../core/services/user.service';

interface DashboardStats {
  totalPeriods: number;
  activePeriods: number;
  totalCareers: number;
  totalUsers: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Gestión del sistema Yavirac</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-label">Periodos Académicos</div>
            <div class="stat-value">{{ stats.totalPeriods }}</div>
            <div class="stat-sublabel">{{ stats.activePeriods }} activos</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <div class="stat-label">Carreras</div>
            <div class="stat-value">{{ stats.totalCareers }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Usuarios</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </div>

        <div class="stat-card action-card">
          <div class="stat-icon">⚙️</div>
          <div class="stat-content">
            <div class="stat-label">Configuración</div>
            <a routerLink="/admin/users" class="stat-link">Gestionar →</a>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/admin/periods/new" class="action-btn">
            <span class="action-icon">➕</span>
            <span>Nuevo Periodo</span>
          </a>
          <a routerLink="/admin/careers/new" class="action-btn">
            <span class="action-icon">📚</span>
            <span>Nueva Carrera</span>
          </a>
          <a routerLink="/admin/users/new" class="action-btn">
            <span class="action-icon">👤</span>
            <span>Nuevo Usuario</span>
          </a>
          <a routerLink="/admin/periods" class="action-btn">
            <span class="action-icon">📋</span>
            <span>Ver Periodos</span>
          </a>
        </div>
      </div>

      <div class="recent-activity" *ngIf="!loading">
        <h2>Actividad Reciente</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">📅</div>
            <div class="activity-content">
              <div class="activity-title">Sistema iniciado</div>
              <div class="activity-time">Hoy</div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;

  /* Imagen de fondo */
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.75),
      rgba(15, 23, 42, 0.75)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');

  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* ================= HEADER ================= */
.dashboard-header {
  margin-bottom: 36px;
}

.dashboard-header h1 {
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
}

.dashboard-header p {
  font-size: 15px;
  color: #e5e7eb;
}

/* ================= STATS ================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 44px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
}

/* Card especial */
.stat-card.action-card {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
}

.stat-card.action-card .stat-label,
.stat-card.action-card .stat-value,
.stat-card.action-card .stat-link {
  color: #ffffff;
}

/* ================= ICONOS ================= */
.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  flex-shrink: 0;
}

.stat-card.action-card .stat-icon {
  background: linear-gradient(135deg, #fbbf24, #f97316);
}

/* ================= TEXTO STATS ================= */
.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 38px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.stat-sublabel {
  font-size: 13px;
  color: #64748b;
}

/* ================= LINK ================= */
.stat-link {
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.stat-link:hover {
  text-decoration: underline;
}

/* ================= ACCIONES RÁPIDAS ================= */
.quick-actions {
  margin-bottom: 44px;
}

.quick-actions h2 {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 22px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 18px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 24px;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-6px);
}

/* Iconos */
.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover .action-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

/* ================= ACTIVIDAD ================= */
.recent-activity {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

.recent-activity h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
}

.activity-item:hover {
  background: #f1f5f9;
}

.activity-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.activity-time {
  font-size: 13px;
  color: #64748b;
}

/* ================= LOADING ================= */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  color: white;
}

.spinner {
  width: 46px;
  height: 46px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`]
})
export class AdminDashboardComponent implements OnInit {
  private periodService = inject(PeriodService);
  private careerService = inject(CareerService);
  private userService = inject(UserService);

  loading = true;
  stats: DashboardStats = {
    totalPeriods: 0,
    activePeriods: 0,
    totalCareers: 0,
    totalUsers: 0
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Cargar periodos
    this.periodService.getAll().subscribe({
      next: (periods) => {
        this.stats.totalPeriods = periods.length;
        this.stats.activePeriods = periods.filter(p => p.status === 'Activo').length;
      },
      error: (error) => console.error('Error loading periods:', error)
    });

    // Cargar carreras
    this.careerService.getAll().subscribe({
      next: (careers) => {
        this.stats.totalCareers = careers.length;
      },
      error: (error) => console.error('Error loading careers:', error)
    });

    // Cargar usuarios
    this.userService.getAll().subscribe({
      next: (users) => {
        this.stats.totalUsers = users.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }
}