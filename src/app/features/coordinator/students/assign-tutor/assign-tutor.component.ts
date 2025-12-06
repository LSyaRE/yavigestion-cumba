import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { Student, Tutor } from '../../../../core/models';

@Component({
  selector: 'app-assign-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="assign-tutor">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          ← Volver
        </button>
        <div>
          <h1>Asignar Tutor Académico</h1>
          <p>Asigna un tutor para supervisar las prácticas del estudiante</p>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- Error Alert -->
      <div class="alert alert-error" *ngIf="errorMessage">
        <span class="alert-icon">⚠️</span>
        <div class="alert-content">
          <strong>Error</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-grid" *ngIf="!loading && student">
        <!-- Student Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Información del Estudiante</h2>
          </div>
          <div class="card-body">
            <div class="student-profile">
              <div class="student-avatar">
                {{ getInitials(student.person?.name, student.person?.lastname) }}
              </div>
              <div class="student-details">
                <h3>{{ student.person?.name }} {{ student.person?.lastname }}</h3>
                <div class="detail-row">
                  <span class="label">DNI:</span>
                  <span class="value">{{ student.person?.dni }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">{{ student.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Carrera:</span>
                  <span class="value">{{ student.career?.name }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Estado SIGA:</span>
                  <span class="value" [class.status-active]="student.isMatriculatedInSIGA">
                    {{ student.isMatriculatedInSIGA ? '✓ Matriculado' : '✗ No Matriculado' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Enrolled Subjects -->
            <div class="subjects-section" *ngIf="student.enrolledSubjects && student.enrolledSubjects.length > 0">
              <h4>Asignaturas Inscritas</h4>
              <div class="subjects-list">
                <div 
                  *ngFor="let subject of student.enrolledSubjects" 
                  class="subject-item"
                  [class.vinculation]="subject.type === 'VINCULATION'"
                  [class.dual]="subject.type === 'DUAL_INTERNSHIP'"
                  [class.prepro]="subject.type === 'PREPROFESSIONAL_INTERNSHIP'"
                >
                  <span class="subject-type">{{ getSubjectTypeLabel(subject.type) }}</span>
                  <span class="subject-period">{{ subject.period?.name }}</span>
                </div>
              </div>
            </div>

            <!-- Current Tutor -->
            <div class="current-tutor" *ngIf="student.tutor">
              <h4>Tutor Actual</h4>
              <div class="tutor-info-box">
                <div class="tutor-avatar">
                  {{ getInitials(student.tutor.person?.name, student.tutor.person?.lastname) }}
                </div>
                <div>
                  <div class="tutor-name">
                    {{ student.tutor.person?.name }} {{ student.tutor.person?.lastname }}
                  </div>
                  <div class="tutor-email">{{ student.tutor.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assign Tutor Form Card -->
        <div class="form-card">
          <div class="card-header">
            <h2>{{ student.tutor ? 'Cambiar Tutor' : 'Asignar Tutor' }}</h2>
          </div>
          <div class="card-body">
            <form [formGroup]="assignForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="tutor">Seleccionar Tutor Académico *</label>
                <select 
                  id="tutor" 
                  formControlName="tutorId" 
                  class="form-control"
                  [class.error]="assignForm.get('tutorId')?.invalid && assignForm.get('tutorId')?.touched"
                >
                  <option value="">-- Seleccione un tutor --</option>
                  <option *ngFor="let tutor of tutors" [value]="tutor.id">
                    {{ tutor.person?.name }} {{ tutor.person?.lastname }} - {{ tutor.email }}
                  </option>
                </select>
                <div 
                  class="error-message" 
                  *ngIf="assignForm.get('tutorId')?.invalid && assignForm.get('tutorId')?.touched"
                >
                  Debe seleccionar un tutor
                </div>
              </div>

              <div class="form-group">
                <label for="notes">Observaciones (opcional)</label>
                <textarea
                  id="notes"
                  formControlName="notes"
                  class="form-control"
                  rows="4"
                  placeholder="Agregue cualquier observación relevante sobre la asignación..."
                ></textarea>
                <small class="help-text">
                  Máximo 500 caracteres ({{ assignForm.get('notes')?.value?.length || 0 }}/500)
                </small>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="goBack()">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="assignForm.invalid || submitting"
                >
                  {{ submitting ? 'Asignando...' : (student.tutor ? 'Cambiar Tutor' : 'Asignar Tutor') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div class="alert alert-success" *ngIf="successMessage">
        <span class="alert-icon">✓</span>
        <div class="alert-content">
          <strong>Éxito</strong>
          <p>{{ successMessage }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assign-tutor {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .page-header {
      margin-bottom: 32px;

      .btn-back {
        background: transparent;
        border: none;
        color: #6b7280;
        font-size: 14px;
        cursor: pointer;
        padding: 8px 0;
        margin-bottom: 16px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: color 0.2s;

        &:hover {
          color: #1f2937;
        }
      }

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

    .loading-spinner {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }

      p {
        color: #6b7280;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      padding: 16px 20px;
      border-radius: 12px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 24px;
      border: 1px solid;

      &.alert-error {
        background: #fee2e2;
        color: #991b1b;
        border-color: #fecaca;
      }

      &.alert-success {
        background: #d1fae5;
        color: #065f46;
        border-color: #a7f3d0;
      }

      .alert-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .alert-content {
        flex: 1;

        strong {
          display: block;
          margin-bottom: 4px;
          font-weight: 600;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .info-card, .form-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;

      h2 {
        font-size: 18px;
        color: #1f2937;
        font-weight: 600;
        margin: 0;
      }
    }

    .card-body {
      padding: 24px;
    }

    .student-profile {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .student-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 20px;
      flex-shrink: 0;
    }

    .student-details {
      flex: 1;

      h3 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 700;
        margin: 0 0 12px 0;
      }
    }

    .detail-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        color: #6b7280;
        font-weight: 500;
        min-width: 80px;
      }

      .value {
        color: #1f2937;
        font-weight: 400;

        &.status-active {
          color: #065f46;
          font-weight: 600;
        }
      }
    }

    .subjects-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .subjects-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .subject-item {
      padding: 12px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;

      &.vinculation {
        background: #fef3c7;
        color: #92400e;
      }

      &.dual {
        background: #dbeafe;
        color: #1e40af;
      }

      &.prepro {
        background: #d1fae5;
        color: #065f46;
      }

      .subject-type {
        font-weight: 600;
      }

      .subject-period {
        font-size: 12px;
        opacity: 0.8;
      }
    }

    .current-tutor {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .tutor-info-box {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #f3f4f6;
      border-radius: 8px;
      align-items: center;
    }

    .tutor-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }

    .tutor-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .tutor-email {
      font-size: 13px;
      color: #6b7280;
    }

    .form-group {
      margin-bottom: 24px;

      label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .form-control {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        color: #1f2937;
        transition: all 0.2s;

        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &.error {
          border-color: #ef4444;
        }
      }

      select.form-control {
        cursor: pointer;
        background-color: white;
      }

      textarea.form-control {
        resize: vertical;
        min-height: 100px;
      }

      .error-message {
        color: #ef4444;
        font-size: 13px;
        margin-top: 6px;
      }

      .help-text {
        display: block;
        color: #6b7280;
        font-size: 12px;
        margin-top: 6px;
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 968px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .assign-tutor {
        padding: 0 16px;
      }

      .student-profile {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .detail-row {
        flex-direction: column;
        gap: 4px;

        .label {
          min-width: auto;
        }
      }

      .form-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class AssignTutorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private tutorService = inject(TutorService);

  assignForm: FormGroup;
  student: Student | null = null;
  tutors: Tutor[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.assignForm = this.fb.group({
      tutorId: ['', Validators.required],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.loadStudent(+studentId);
      this.loadTutors();
    } else {
      this.errorMessage = 'ID de estudiante no válido';
      this.loading = false;
    }
  }

  private loadStudent(studentId: number): void {
    this.studentService.getById(studentId).subscribe({
      next: (student) => {
        this.student = student;
        
        // VALIDACIÓN CRÍTICA: Verificar que el estudiante esté matriculado en SIGA
        if (!student.isMatriculatedInSIGA) {
          this.errorMessage = 'Este estudiante no está matriculado en SIGA. No se puede asignar un tutor hasta que complete su matriculación.';
          this.loading = false;
          
          // Redirigir automáticamente después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/coordinator/students']);
          }, 3000);
          
          return;
        }

        // Si ya tiene tutor asignado, pre-cargar el formulario
        if (student.tutor) {
          this.assignForm.patchValue({
            tutorId: student.tutor.id
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la información del estudiante';
        this.loading = false;
        console.error('Error loading student:', error);
      }
    });
  }

  private loadTutors(): void {
    this.tutorService.getAll().subscribe({
      next: (tutors) => {
        this.tutors = tutors;
      },
      error: (error) => {
        console.error('Error loading tutors:', error);
        this.errorMessage = 'Error al cargar la lista de tutores';
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid || !this.student) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const tutorId = +this.assignForm.value.tutorId;

    this.studentService.assignTutor(this.student.id!, tutorId).subscribe({
      next: () => {
        this.successMessage = 'Tutor asignado exitosamente';
        this.submitting = false;

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/coordinator/students']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al asignar el tutor. Por favor, intente nuevamente.';
        this.submitting = false;
        console.error('Error assigning tutor:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/coordinator/students']);
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getSubjectTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación con la Sociedad',
      'DUAL_INTERNSHIP': 'Prácticas Formación Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas Preprofesionales'
    };
    return labels[type] || type;
  }
}