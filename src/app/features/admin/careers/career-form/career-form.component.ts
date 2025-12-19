import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models';

@Component({
  selector: 'app-career-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="career-form-container">
      <div class="form-header">
        <a routerLink="/admin/careers" class="back-link">← Volver</a>
        <h1>{{ isEditMode ? 'Editar Carrera' : 'Nueva Carrera' }}</h1>
        <p>{{ isEditMode ? 'Modificar información de la carrera' : 'Crear una nueva carrera académica' }}</p>
      </div>

      <form [formGroup]="careerForm" (ngSubmit)="onSubmit()" class="career-form">
        <div class="form-card">
          <h2>Información de la Carrera</h2>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="name">Nombre de la Carrera *</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
                placeholder="Ej: Desarrollo de Software"
                [class.is-invalid]="name?.invalid && name?.touched"
              >
              <div class="invalid-feedback" *ngIf="name?.invalid && name?.touched">
                <span *ngIf="name?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="description">Descripción</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-control"
                rows="3"
                placeholder="Descripción de la carrera"
              ></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="isDual">Tipo de Carrera *</label>
              <select
                id="isDual"
                formControlName="isDual"
                class="form-control"
                [class.is-invalid]="isDual?.invalid && isDual?.touched"
              >
                <option value="">Seleccione el tipo</option>
                <option [value]="true">Carrera Dual</option>
                <option [value]="false">Carrera Tradicional</option>
              </select>
              <div class="invalid-feedback" *ngIf="isDual?.invalid && isDual?.touched">
                <span *ngIf="isDual?.errors?.['required']">El tipo es requerido</span>
              </div>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select
                id="status"
                formControlName="status"
                class="form-control"
                [class.is-invalid]="status?.invalid && status?.touched"
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div class="invalid-feedback" *ngIf="status?.invalid && status?.touched">
                <span *ngIf="status?.errors?.['required']">El estado es requerido</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h3>ℹ️ Tipos de Carrera</h3>
            <ul>
              <li><strong>Dual:</strong> Incluye prácticas de formación dual (obligatorias/curriculares)</li>
              <li><strong>Tradicional:</strong> Incluye vinculación + prácticas preprofesionales (complementarias)</li>
            </ul>
          </div>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/admin/careers" class="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="careerForm.invalid || loading"
          >
            <span *ngIf="!loading">{{ isEditMode ? 'Actualizar' : 'Crear Carrera' }}</span>
            <span *ngIf="loading">{{ isEditMode ? 'Actualizando...' : 'Creando...' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
/* CONTENEDOR */
.career-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

/* HEADER */
.form-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  margin-bottom: 8px;
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.form-header h1 {
  margin: 0;
  font-size: 26px;
  color: #0f172a;
}

.form-header p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

/* FORM CARD */
.form-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.form-card h2 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #1e3a8a;
}

/* FORM GRID */
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-width {
  flex: 100%;
}

/* LABELS */
.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

/* INPUTS */
.form-control {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.25s ease;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  outline: none;
}

/* INVALID */
.is-invalid {
  border-color: #dc2626;
}

.invalid-feedback {
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
}

/* INFO BOX */
.info-box {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  border-radius: 10px;
  padding: 16px;
  margin-top: 20px;
}

.info-box h3 {
  font-size: 14px;
  color: #1e40af;
  margin-bottom: 10px;
  font-weight: 600;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  font-size: 13px;
  color: #1e40af;
  margin-bottom: 8px;
}

/* ALERT ERROR */
.alert-danger {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 20px;
}

/* ACTIONS */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* BUTTONS */
.btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1e40af;
}

.btn-primary:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
`]
})
export class CareerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private careerService = inject(CareerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  careerForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  careerId?: number;

  constructor() {
    this.careerForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isDual: ['', Validators.required],
      status: ['Activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.careerId = +params['id'];
        this.loadCareer(this.careerId);
      }
    });
  }

  private loadCareer(id: number): void {
    this.loading = true;
    this.careerService.getById(id).subscribe({
      next: (career) => {
        this.careerForm.patchValue({
          name: career.name,
          description: career.description,
          isDual: career.isDual,
          status: career.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la carrera';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.careerForm.invalid) {
      this.markFormGroupTouched(this.careerForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const careerData: Career = {
      ...this.careerForm.value,
      id: this.careerId || 0
    };

    const request = this.isEditMode && this.careerId
      ? this.careerService.update(this.careerId, careerData)
      : this.careerService.create(careerData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/careers']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al guardar la carrera';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.careerForm.get('name'); }
  get isDual() { return this.careerForm.get('isDual'); }
  get status() { return this.careerForm.get('status'); }
}