import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { CareerService } from '../../../core/services/career.service';
import { Student, Career, SubjectType } from '../../../core/models';

interface DashboardStats {
  totalStudents: number;
  vinculationStudents: number;
  dualInternshipStudents: number;
  preprofessionalStudents: number;
  matriculatedInSIGA: number;
  withTutor: number;
}

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="coordinator-dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard de Coordinación</h1>
          <p>Resumen de estudiantes y actividades</p>
        </div>
        <button class="btn btn-primary" routerLink="/coordinator/students">
          Ver Todos los Estudiantes
        </button>
      </div>

      <!-- Estadísticas Principales -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Total Estudiantes</div>
            <div class="stat-value">{{ stats.totalStudents }}</div>
            <div class="stat-sublabel">En tus carreras</div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <div class="stat-label">Matriculados SIGA</div>
            <div class="stat-value">{{ stats.matriculatedInSIGA }}</div>
            <div class="stat-sublabel">{{ getPercentage(stats.matriculatedInSIGA, stats.totalStudents) }}% del total</div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">👔</div>
          <div class="stat-content">
            <div class="stat-label">Con Tutor Asignado</div>
            <div class="stat-value">{{ stats.withTutor }}</div>
            <div class="stat-sublabel">{{ getPercentage(stats.withTutor, stats.totalStudents) }}% del total</div>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-label">Mis Carreras</div>
            <div class="stat-value">{{ careers.length }}</div>
            <div class="stat-sublabel">Carreras coordinadas</div>
          </div>
        </div>
      </div>

      <!-- Distribución por Tipo de Formación -->
      <div class="section-card">
        <div class="section-header">
          <h2>📊 Distribución por Tipo de Formación</h2>
          <p>Estudiantes según su tipo de asignatura</p>
        </div>

        <div class="formation-types-grid">
          <div class="formation-card vinculation">
            <div class="formation-header">
              <div class="formation-icon">🤝</div>
              <div class="formation-title">Vinculación con la Comunidad</div>
            </div>
            <div class="formation-stats">
              <div class="formation-count">{{ stats.vinculationStudents }}</div>
              <div class="formation-subtitle">estudiantes</div>
              <div class="formation-hours">160 horas</div>
            </div>
            <button class="btn btn-sm btn-outline" routerLink="/coordinator/students" [queryParams]="{type: 'VINCULATION'}">
              Ver Estudiantes →
            </button>
          </div>

          <div class="formation-card dual">
            <div class="formation-header">
              <div class="formation-icon">🎓</div>
              <div class="formation-title">Prácticas Formación Dual</div>
            </div>
            <div class="formation-stats">
              <div class="formation-count">{{ stats.dualInternshipStudents }}</div>
              <div class="formation-subtitle">estudiantes</div>
              <div class="formation-hours">Obligatorias/Curriculares</div>
            </div>
            <button class="btn btn-sm btn-outline" routerLink="/coordinator/students" [queryParams]="{type: 'DUAL_INTERNSHIP'}">
              Ver Estudiantes →
            </button>
          </div>

          <div class="formation-card prepro">
            <div class="formation-header">
              <div class="formation-icon">💼</div>
              <div class="formation-title">Prácticas Preprofesionales</div>
            </div>
            <div class="formation-stats">
              <div class="formation-count">{{ stats.preprofessionalStudents }}</div>
              <div class="formation-subtitle">estudiantes</div>
              <div class="formation-hours">Complementarias</div>
            </div>
            <button class="btn btn-sm btn-outline" routerLink="/coordinator/students" [queryParams]="{type: 'PREPROFESSIONAL_INTERNSHIP'}">
              Ver Estudiantes →
            </button>
          </div>
        </div>
      </div>

      <!-- Mis Carreras -->
      <div class="section-card">
        <div class="section-header">
          <h2>🎓 Mis Carreras</h2>
          <p>Carreras bajo tu coordinación</p>
        </div>

        <div class="careers-list" *ngIf="careers.length > 0">
          <div class="career-item" *ngFor="let career of careers">
            <div class="career-info">
              <div class="career-icon">
                {{ career.isDual ? '🎓' : '📚' }}
              </div>
              <div class="career-details">
                <div class="career-name">{{ career.name }}</div>
                <div class="career-type">
                  {{ career.isDual ? 'Carrera Dual' : 'Carrera Tradicional' }}
                </div>
              </div>
            </div>
            <div class="career-stats">
              <span class="stat-badge">
                {{ getStudentsByCareer(career.id) }} estudiantes
              </span>
              <span class="status-badge" [class.active]="career.status === 'Activo'">
                {{ career.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="empty-state-small" *ngIf="careers.length === 0">
          <p>No tienes carreras asignadas</p>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="section-card">
        <div class="section-header">
          <h2>⚡ Acciones Rápidas</h2>
        </div>

        <div class="quick-actions-grid">
          <a routerLink="/coordinator/students" class="action-card">
            <div class="action-icon">👥</div>
            <div class="action-title">Gestionar Estudiantes</div>
            <div class="action-description">Ver y filtrar estudiantes</div>
          </a>

          <a routerLink="/coordinator/students" [queryParams]="{siga: 'false'}" class="action-card">
            <div class="action-icon">⚠️</div>
            <div class="action-title">No Matriculados</div>
            <div class="action-description">{{ stats.totalStudents - stats.matriculatedInSIGA }} sin matrícula SIGA</div>
          </a>

          <a routerLink="/coordinator/students" [queryParams]="{tutor: 'false'}" class="action-card">
            <div class="action-icon">🔍</div>
            <div class="action-title">Sin Tutor</div>
            <div class="action-description">{{ stats.totalStudents - stats.withTutor }} sin tutor asignado</div>
          </a>

          <a routerLink="/coordinator/reports" class="action-card">
            <div class="action-icon">📄</div>
            <div class="action-title">Generar Reportes</div>
            <div class="action-description">Exportar información</div>
          </a>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    </div>
  `,
  styles: [`
   /* ================= CONTENEDOR ================= */
.coordinator-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* ================= HEADER ================= */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.dashboard-header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* ================= STATS ================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.stat-card.primary { border-color: #667eea; }
.stat-card.success { border-color: #10b981; }
.stat-card.warning { border-color: #f59e0b; }
.stat-card.info    { border-color: #3b82f6; }

.stat-icon {
  font-size: 40px;
  line-height: 1;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-sublabel {
  font-size: 13px;
  color: #9ca3af;
}

/* ================= SECCIONES ================= */
.section-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.section-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* ================= FORMACIONES ================= */
.formation-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.formation-card {
  border: 2px solid;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;
}

.formation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.formation-card.vinculation {
  border-color: #fbbf24;
  background: #fffbeb;
}

.formation-card.dual {
  border-color: #3b82f6;
  background: #eff6ff;
}

.formation-card.prepro {
  border-color: #10b981;
  background: #ecfdf5;
}

.formation-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.formation-icon {
  font-size: 32px;
}

.formation-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.formation-stats {
  text-align: center;
  margin-bottom: 20px;
}

.formation-count {
  font-size: 48px;
  font-weight: 700;
  color: #1f2937;
}

.formation-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.formation-hours {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

/* ================= CARRERAS ================= */
.careers-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.career-item:hover {
  background: #f9fafb;
  border-color: #667eea;
}

.career-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.career-icon {
  font-size: 32px;
}

.career-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.career-type {
  font-size: 13px;
  color: #6b7280;
}

.career-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-badge {
  padding: 4px 12px;
  background: #f3f4f6;
  color: #374151;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* ================= ESTADOS ================= */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

/* ================= ACCIONES ================= */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.action-card {
  padding: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #667eea;
  background: #f5f7ff;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.action-description {
  font-size: 13px;
  color: #6b7280;
}

/* ================= LOADING ================= */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
  }

  .stats-grid,
  .formation-types-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class CoordinatorDashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);

  students: Student[] = [];
  careers: Career[] = [];
  loading = true;
  
  stats: DashboardStats = {
    totalStudents: 0,
    vinculationStudents: 0,
    dualInternshipStudents: 0,
    preprofessionalStudents: 0,
    matriculatedInSIGA: 0,
    withTutor: 0
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Cargar carreras del coordinador
    this.careerService.getByCoordinator().subscribe({
      next: (careers) => {
        this.careers = careers;
      },
      error: (error) => console.error('Error loading careers:', error)
    });

    // Cargar estudiantes
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalStudents = this.students.length;
    this.stats.matriculatedInSIGA = this.students.filter(s => s.isMatriculatedInSIGA).length;
    this.stats.withTutor = this.students.filter(s => s.tutor).length;

    // Contar estudiantes por tipo de formación
    this.students.forEach(student => {
      student.enrolledSubjects?.forEach(subject => {
        switch(subject.type) {
          case 'VINCULATION':
            this.stats.vinculationStudents++;
            break;
          case 'DUAL_INTERNSHIP':
            this.stats.dualInternshipStudents++;
            break;
          case 'PREPROFESSIONAL_INTERNSHIP':
            this.stats.preprofessionalStudents++;
            break;
        }
      });
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  getStudentsByCareer(careerId: number): number {
    return this.students.filter(s => s.career?.id === careerId).length;
  }
}