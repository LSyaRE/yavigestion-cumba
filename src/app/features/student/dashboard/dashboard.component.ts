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
        <h1>¡Bienvenido, {{ studentName }}! 👋</h1>
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
              <span>🆔 {{ student.person?.dni }}</span>
              <span>✉️ {{ student.email }}</span>
              <span>🎓 {{ student.career?.name || 'Sin carrera' }}</span>
            </div>
            <div class="status-badges">
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                {{ student.isMatriculatedInSIGA ? '✓ Matriculado SIGA' : '✗ No matriculado SIGA' }}
              </span>
              <span class="badge" [class.active]="student.tutor">
                {{ student.tutor ? '✓ Tutor asignado' : '⏳ Sin tutor' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Asignaturas -->
      <div class="section-card">
        <h2>📚 Mis Asignaturas</h2>
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
              {{ getSubjectIcon(subject.type) }}
            </div>
            <div class="subject-info">
              <h3>{{ getSubjectName(subject.type) }}</h3>
              <p>{{ getSubjectDescription(subject.type) }}</p>
              <div class="subject-meta">
                <span *ngIf="subject.enterprise">🏢 {{ subject.enterprise.name }}</span>
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
          <div class="empty-icon">📚</div>
          <p>No tienes asignaturas activas</p>
          <p class="empty-hint">Contacta a tu coordinador de carrera</p>
        </div>
      </div>

      <!-- Información del Tutor -->
      <div class="section-card" *ngIf="student?.tutor">
        <h2>👔 Mi Tutor Empresarial</h2>
        
        <div class="tutor-info-card">
          <div class="tutor-avatar">
            {{ getInitials(student?.tutor?.person?.name, student?.tutor?.person?.lastname) }}
          </div>
          <div class="tutor-details">
            <h3>{{ student?.tutor?.person?.name }} {{ student?.tutor?.person?.lastname }}</h3>
            <div class="tutor-contact">
              <span>✉️ {{ student?.tutor?.email }}</span>
              <span *ngIf="student?.tutor?.person?.phonenumber">
                📞 {{ student?.tutor?.person?.phonenumber }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="section-card">
        <h2>⚡ Acciones Rápidas</h2>
        
        <div class="actions-grid">
          <a routerLink="/student/documents" class="action-card">
            <div class="action-icon">📄</div>
            <div class="action-title">Mis Documentos</div>
            <div class="action-description">Ver documentos generados</div>
          </a>

          <a routerLink="/student/subjects/vinculation" class="action-card" *ngIf="hasSubjectType('VINCULATION')">
            <div class="action-icon">🤝</div>
            <div class="action-title">Vinculación</div>
            <div class="action-description">160 horas comunitarias</div>
          </a>

          <a routerLink="/student/subjects/dual-internship" class="action-card" *ngIf="hasSubjectType('DUAL_INTERNSHIP')">
            <div class="action-icon">🎓</div>
            <div class="action-title">Prácticas Dual</div>
            <div class="action-description">Prácticas formativas</div>
          </a>

          <a routerLink="/student/subjects/preprofessional-internship" class="action-card" *ngIf="hasSubjectType('PREPROFESSIONAL_INTERNSHIP')">
            <div class="action-icon">💼</div>
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
  --blue: #1e40af;
  --orange: #f97316;
  --black: #111827;
  --white: #ffffff;
  --gray-bg: #f3f4f6;
  --gray-text: #6b7280;
  --border: #e5e7eb;

  --radius: 14px;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* ================= CONTAINER ================= */
.student-dashboard {
  min-height: 100vh;
  background: var(--gray-bg);
  padding: 32px 16px 48px;
}

/* ================= WELCOME ================= */
.welcome-section {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.welcome-section h1 {
  font-size: 32px;
  font-weight: 800;
  color: var(--blue);
  margin-bottom: 6px;
}

.welcome-section p {
  color: var(--gray-text);
  font-size: 15px;
}

/* ================= INFO CARD ================= */
.info-card {
  max-width: 1200px;
  margin: 0 auto 32px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 28px;
}

.info-header {
  display: flex;
  gap: 24px;
  align-items: center;
}

.student-avatar-large {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--blue);
  color: var(--white);
  font-size: 32px;
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
  color: var(--gray-text);
}

.status-badges {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  background: #fff7ed;
  color: var(--orange);
}

.badge.active {
  background: #eff6ff;
  color: var(--blue);
  border-color: #bfdbfe;
}

/* ================= SECTION CARD ================= */
.section-card {
  max-width: 1200px;
  margin: 0 auto 32px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 28px;
}

.section-card h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--blue);
  margin-bottom: 6px;
}

.section-description {
  font-size: 14px;
  color: var(--gray-text);
  margin-bottom: 24px;
}

/* ================= SUBJECTS ================= */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.subject-card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  border-top: 4px solid var(--blue);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subject-card.vinculation {
  border-top-color: var(--orange);
}

.subject-card.dual {
  border-top-color: var(--blue);
}

.subject-card.prepro {
  border-top-color: var(--black);
}

.subject-icon {
  font-size: 40px;
}

.subject-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 4px;
}

.subject-info p {
  font-size: 14px;
  color: var(--gray-text);
}

.subject-meta {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--gray-text);
}

/* ================= BUTTON ================= */
.btn {
  margin-top: auto;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

.btn-primary {
  background: var(--blue);
  color: var(--white);
}

.btn-primary:hover {
  background: #1e3a8a;
}

/* ================= EMPTY ================= */
.empty-state {
  text-align: center;
  padding: 48px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-hint {
  font-size: 14px;
  color: var(--gray-text);
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
  color: var(--white);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tutor-details h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--black);
}

.tutor-contact {
  font-size: 14px;
  color: var(--gray-text);
}

/* ================= ACTIONS ================= */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.action-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
  text-decoration: none;
  text-align: center;
}

.action-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.action-title {
  font-weight: 700;
  color: var(--black);
}

.action-description {
  font-size: 14px;
  color: var(--gray-text);
}

/* ================= LOADING ================= */
.loading-spinner {
  text-align: center;
  padding: 40px;
  color: var(--blue);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .info-header,
  .tutor-info-card {
    flex-direction: column;
    text-align: center;
  }

  .welcome-section h1 {
    font-size: 26px;
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
    const icons: { [key: string]: string } = {
      'VINCULATION': '🤝',
      'DUAL_INTERNSHIP': '🎓',
      'PREPROFESSIONAL_INTERNSHIP': '💼'
    };
    return icons[type] || '📚';
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