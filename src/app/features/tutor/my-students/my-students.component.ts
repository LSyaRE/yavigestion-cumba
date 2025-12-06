import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-students">
      <div class="header">
        <h1>👥 Mis Estudiantes</h1>
        <p>Estudiantes bajo tu supervisión</p>
      </div>

      <div class="students-grid" *ngIf="!loading && students.length > 0">
        <div class="student-card" *ngFor="let student of students">
          <div class="student-header">
            <div class="student-avatar">
              {{ getInitials(student.person?.name, student.person?.lastname) }}
            </div>
            <div class="student-info">
              <div class="student-name">
                {{ student.person?.name }} {{ student.person?.lastname }}
              </div>
              <div class="student-meta">
                <span>✉️ {{ student.email }}</span>
                <span>🆔 {{ student.person?.dni }}</span>
              </div>
            </div>
          </div>

          <div class="student-details">
            <div class="detail-row">
              <span class="label">Carrera:</span>
              <span class="value">{{ student.career?.name || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">SIGA:</span>
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                {{ student.isMatriculatedInSIGA ? 'Matriculado' : 'No matriculado' }}
              </span>
            </div>
          </div>

          <div class="student-subjects">
            <span class="label">Asignaturas:</span>
            <div class="subjects-list">
              <span 
                *ngFor="let subject of student.enrolledSubjects" 
                class="subject-badge"
              >
                {{ getSubjectLabel(subject.type) }}
              </span>
            </div>
          </div>

          <div class="student-actions">
            <a 
              [routerLink]="['/tutor/evaluate', student.id]" 
              class="btn btn-primary btn-block"
            >
              📝 Evaluar Estudiante
            </a>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && students.length === 0">
        <div class="empty-icon">👥</div>
        <h3>No tienes estudiantes asignados</h3>
        <p>Contacta al coordinador de carrera</p>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>
    </div>
  `,
  styles: [`
    .my-students {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
        color: #1f2937;
        margin-bottom: 8px;
        font-weight: 700;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .students-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .student-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
      }

      .student-header {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f3f4f6;

        .student-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          flex-shrink: 0;
        }

        .student-info {
          flex: 1;

          .student-name {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }

          .student-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;

            span {
              font-size: 13px;
              color: #6b7280;
            }
          }
        }
      }

      .student-details {
        margin-bottom: 16px;

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;

          .label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
          }

          .value {
            font-size: 14px;
            color: #1f2937;
            font-weight: 600;
          }

          .badge {
            padding: 4px 12px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;

            &.active {
              background: #d1fae5;
              color: #065f46;
            }
          }
        }
      }

      .student-subjects {
        margin-bottom: 20px;

        .label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 8px;
        }

        .subjects-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;

          .subject-badge {
            padding: 6px 12px;
            background: #fef3c7;
            color: #92400e;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
          }
        }
      }
    }

    .empty-state, .loading-spinner {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        margin: 0;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .students-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyStudentsComponent implements OnInit {
  private studentService = inject(StudentService);

  students: Student[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.loading = true;
    this.studentService.getMyStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getSubjectLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesional'
    };
    return labels[type] || type;
  }
}