import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="student-dashboard">
      <div class="welcome-section">
        <h1>¡Bienvenido, {{ studentName }}! 
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display: inline; vertical-align: middle;">
            <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" fill="#FCD34D"/>
            <path d="M10 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM18 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM10 20c0-2.21 2.69-4 6-4s6 1.79 6 4" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </h1>
        <p>Gestiona tus asignaturas y documentos</p>
      </div>

      <!-- Información del Estudiante -->
      <div class="info-card" *ngIf="student">
        <div class="info-header">
          <div class="student-avatar-large">
            {{ getInitials(student.person?.name, student.person?.lastname) }}
          </div>
          <div class="student-details">
            <h2>{{ student.person?.name }} {{ student.person?.lastname }}</h2>
            <div class="student-meta">
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: inline; vertical-align: middle;">
                  <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5 7h6M5 10h4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ student.person?.dni }}
              </span>
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: inline; vertical-align: middle;">
                  <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 6l6 4 6-4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ student.email }}
              </span>
              <span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: inline; vertical-align: middle;">
                  <path d="M8 2L2 5l6 3 6-3-6-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M2 11l6 3 6-3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
                {{ student.career?.name || 'Sin carrera' }}
              </span>
            </div>
            <div class="status-badges">
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle;">
                  <path *ngIf="student.isMatriculatedInSIGA" d="M12 4L5.5 10.5L2 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path *ngIf="!student.isMatriculatedInSIGA" d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ student.isMatriculatedInSIGA ? 'Matriculado SIGA' : 'No matriculado SIGA' }}
              </span>
              <span class="badge" [class.active]="student.tutor">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle;">
                  <path *ngIf="student.tutor" d="M12 4L5.5 10.5L2 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <circle *ngIf="!student.tutor" cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ student.tutor ? 'Tutor asignado' : 'Sin tutor' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Asignaturas -->
      <div class="section-card">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="2"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Mis Asignaturas
        </h2>
        <p class="section-description">Accede a tus asignaturas activas</p>

        <div class="subjects-grid" *ngIf="student?.enrolledSubjects && (student?.enrolledSubjects?.length ?? 0) > 0">
          <div 
            *ngFor="let subject of student?.enrolledSubjects" 
            class="subject-card"
            [class.vinculation]="subject.type === 'VINCULATION'"
            [class.dual]="subject.type === 'DUAL_INTERNSHIP'"
            [class.prepro]="subject.type === 'PREPROFESSIONAL_INTERNSHIP'"
          >
            <div class="subject-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <ng-container *ngIf="subject.type === 'VINCULATION'">
                  <path d="M12 10c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v-4h-2v-2h2v-2h-2v-2h2v-2h-2z" fill="currentColor"/>
                  <path d="M20 10c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v-4h-2v-2h2v-2h-2v-2h2v-2h-2z" fill="currentColor"/>
                </ng-container>
                <ng-container *ngIf="subject.type === 'DUAL_INTERNSHIP'">
                  <path d="M16 4l-8 6v12h6v-6h4v6h6V10l-8-6z" stroke="currentColor" stroke-width="2"/>
                </ng-container>
                <ng-container *ngIf="subject.type === 'PREPROFESSIONAL_INTERNSHIP'">
                  <rect x="6" y="10" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M10 8h12v2H10z" fill="currentColor"/>
                </ng-container>
              </svg>
            </div>
            <div class="subject-info">
              <h3>{{ getSubjectName(subject.type) }}</h3>
              <p>{{ getSubjectDescription(subject.type) }}</p>
              <div class="subject-meta">
                <span *ngIf="subject.enterprise">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle;">
                    <rect x="2" y="4" width="10" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M4 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  {{ subject.enterprise.name }}
                </span>
                <span class="status-badge" [class.active]="subject.status === 'EnCurso'">
                  {{ subject.status }}
                </span>
              </div>
            </div>
            <a [routerLink]="getSubjectRoute(subject.type)" class="btn btn-primary btn-block">
              Acceder →
            </a>
          </div>
        </div>

        <div class="empty-state" *ngIf="!student?.enrolledSubjects || (student?.enrolledSubjects?.length ?? 0) === 0">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M16 48a4 4 0 0 1 4-4h24a4 4 0 0 1 0 8H20a4 4 0 0 1-4-4z" fill="#E5E7EB"/>
              <path d="M20 12h24v32H20V12z" stroke="#9CA3AF" stroke-width="2"/>
              <path d="M28 20h8M28 28h8M28 36h8" stroke="#9CA3AF" stroke-width="2"/>
            </svg>
          </div>
          <p>No tienes asignaturas activas</p>
          <p class="empty-hint">Contacta a tu coordinador de carrera</p>
        </div>
      </div>

      <!-- Información del Tutor -->
      <div class="section-card" *ngIf="student?.tutor">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M8 11h8M8 15h5" stroke="currentColor" stroke-width="2"/>
          </svg>
          Mi Tutor Empresarial
        </h2>
        
        <div class="tutor-info-card">
          <div class="tutor-avatar">
            {{ getInitials(student?.tutor?.person?.name, student?.tutor?.person?.lastname) }}
          </div>
          <div class="tutor-details">
            <h3>{{ student?.tutor?.person?.name }} {{ student?.tutor?.person?.lastname }}</h3>
            <div class="tutor-contact">
              <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle;">
                  <rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M1 5l6 3 6-3" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ student?.tutor?.email }}
              </span>
              <span *ngIf="student?.tutor?.person?.phonenumber">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle;">
                  <path d="M3 2h2l1 3-1.5 1.5a8 8 0 0 0 4 4L10 9l3 1v2a2 2 0 0 1-2 2A10 10 0 0 1 1 4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ student?.tutor?.person?.phonenumber }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="section-card">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Acciones Rápidas
        </h2>
        
        <div class="actions-grid">
          <a routerLink="/student/documents" class="action-card">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M10 4h8l6 6v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
                <path d="M18 4v6h6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="action-title">Mis Documentos</div>
            <div class="action-description">Ver documentos generados</div>
          </a>

          <a routerLink="/student/subjects/vinculation" class="action-card" *ngIf="hasSubjectType('VINCULATION')">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M12 10c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v-4h-2v-2h2v-2h-2v-2h2v-2h-2z" fill="currentColor"/>
                <path d="M20 10c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2v-4h-2v-2h2v-2h-2v-2h2v-2h-2z" fill="currentColor"/>
              </svg>
            </div>
            <div class="action-title">Vinculación</div>
            <div class="action-description">160 horas comunitarias</div>
          </a>

          <a routerLink="/student/subjects/dual-internship" class="action-card" *ngIf="hasSubjectType('DUAL_INTERNSHIP')">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4l-8 6v12h6v-6h4v6h6V10l-8-6z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="action-title">Prácticas Dual</div>
            <div class="action-description">Prácticas formativas</div>
          </a>

          <a routerLink="/student/subjects/preprofessional-internship" class="action-card" *ngIf="hasSubjectType('PREPROFESSIONAL_INTERNSHIP')">
            <div class="action-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="10" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M10 8h12v2H10z" fill="currentColor"/>
              </svg>
            </div>
            <div class="action-title">Prácticas Preprofesionales</div>
            <div class="action-description">Prácticas complementarias</div>
          </a>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    </div>
  `,
  styles: [`
/* ================= VARIABLES ================= */
:host {
  --blue: #2563eb;
  --blue-dark: #1e40af;
  --blue-soft: #eff6ff;
  --orange: #f97316;
  --black: #0f172a;
  --gray: #6b7280;
  --border: #e5e7eb;
}

/* ================= CONTAINER ================= */
.student-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

/* ================= HEADER ================= */
.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 30px;
  font-weight: 800;
  color: var(--black);
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 15px;
  color: var(--gray);
}

/* ================= CARDS ================= */
.info-card,
.section-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

/* ================= INFO ================= */
.info-header {
  display: flex;
  gap: 24px;
  align-items: center;
}

.student-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: white;
  font-size: 26px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-details h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 10px;
}

.student-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 14px;
  color: var(--gray);
}

.student-meta svg {
  margin-right: 4px;
}

/* ================= BADGES ================= */
.status-badges {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: #f9fafb;
  color: var(--gray);
}

.badge svg {
  margin-right: 4px;
}

.badge.active {
  background: var(--blue-soft);
  color: var(--blue);
  border-color: #bfdbfe;
}

/* ================= SECTIONS ================= */
.section-card h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 6px;
}

.section-description {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 24px;
}

/* ================= SUBJECTS ================= */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.subject-card {
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.25s ease;
}

.subject-card:hover {
  border-color: var(--blue);
  box-shadow: 0 10px 25px rgba(37,99,235,0.15);
}

.subject-icon {
  color: var(--blue);
}

.subject-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.subject-info p {
  font-size: 14px;
  color: var(--gray);
}

.subject-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--gray);
}

.subject-meta svg {
  margin-right: 4px;
}

/* ================= BUTTON ================= */
.btn {
  margin-top: auto;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.btn-primary {
  background: var(--blue);
  color: white;
}

.btn-primary:hover {
  background: var(--blue-dark);
}

/* ================= TUTOR ================= */
.tutor-info-card {
  display: flex;
  gap: 20px;
  align-items: center;
}

.tutor-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--orange);
  color: white;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tutor-details h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--black);
}

.tutor-contact {
  font-size: 14px;
  color: var(--gray);
}

.tutor-contact svg {
  margin-right: 4px;
}

/* ================= ACTIONS ================= */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  padding: 20px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
  text-align: center;
}

.action-card:hover {
  border-color: var(--blue);
  box-shadow: 0 8px 20px rgba(37,99,235,0.1);
}

.action-icon {
  color: var(--blue);
  margin-bottom: 12px;
}

.action-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.action-description {
  font-size: 13px;
  color: var(--gray);
}

/* ================= STATES ================= */
.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--gray);
}

.empty-icon {
  margin-bottom: 16px;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .info-header,
  .tutor-info-card {
    flex-direction: column;
    text-align: center;
  }

  .subjects-grid {
    grid-template-columns: 1fr;
  }
}

`]
})
export class StudentDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private studentService = inject(StudentService);

  student?: Student;
  loading = true;
  studentName = 'Estudiante';

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.studentService.getById(currentUser.id).subscribe({
        next: (student) => {
          this.student = student;
          this.studentName = student.person?.name || 'Estudiante';
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading student:', error);
          this.loading = false;
        }
      });
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'E';
  }

  getSubjectIcon(type: string): string {
    return ''; // Ya no se usa, los iconos son SVG
  }

  getSubjectName(type: string): string {
    const names: { [key: string]: string } = {
      'VINCULATION': 'Vinculación con la Comunidad',
      'DUAL_INTERNSHIP': 'Prácticas de Formación Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas Preprofesionales'
    };
    return names[type] || type;
  }

  getSubjectDescription(type: string): string {
    const descriptions: { [key: string]: string } = {
      'VINCULATION': '160 horas de servicio comunitario',
      'DUAL_INTERNSHIP': 'Prácticas curriculares obligatorias',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas complementarias'
    };
    return descriptions[type] || '';
  }

  getSubjectRoute(type: string): string {
    const routes: { [key: string]: string } = {
      'VINCULATION': '/student/subjects/vinculation',
      'DUAL_INTERNSHIP': '/student/subjects/dual-internship',
      'PREPROFESSIONAL_INTERNSHIP': '/student/subjects/preprofessional-internship'
    };
    return routes[type] || '/student/dashboard';
  }

  hasSubjectType(type: string): boolean {
    return this.student?.enrolledSubjects?.some(s => s.type === type) || false;
  }
}