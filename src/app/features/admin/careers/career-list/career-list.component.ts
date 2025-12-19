import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models';

@Component({
  selector: 'app-career-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="career-list">
      <div class="list-header">
        <div>
          <h1>Gestión de Carreras</h1>
          <p>Administración de carreras académicas</p>
        </div>
        <a routerLink="/admin/careers/new" class="btn btn-primary">
          ➕ Nueva Carrera
        </a>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando carreras...</p>
      </div>

      <div class="careers-grid" *ngIf="!loading && careers.length > 0">
        <div class="career-card" *ngFor="let career of careers">
          <div class="career-header">
            <h3>{{ career.name }}</h3>
            <span class="career-status" [class.active]="career.status === 'Activo'">
              {{ career.status }}
            </span>
          </div>

          <div class="career-body">
            <p *ngIf="career.description">{{ career.description }}</p>
            
            <div class="career-info">
              <span class="info-badge" *ngIf="career.isDual">
                🎓 Carrera Dual
              </span>
              <span class="info-badge" *ngIf="!career.isDual">
                📚 Carrera Tradicional
              </span>
            </div>
          </div>

          <div class="career-actions">
            <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
              ✏️ Editar
            </a>
            <button class="btn btn-sm btn-danger" (click)="deleteCareer(career)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && careers.length === 0">
        <div class="empty-icon">🎓</div>
        <h3>No hay carreras registradas</h3>
        <p>Comienza creando la primera carrera</p>
        <a routerLink="/admin/careers/new" class="btn btn-primary">
          Crear Primera Carrera
        </a>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.career-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* ================= HEADER ================= */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.list-header h1 {
  margin: 0;
  font-size: 28px;
  color: #0f172a;
}

.list-header p {
  margin-top: 4px;
  font-size: 14px;
  color: #6b7280;
}

/* ================= BOTONES ================= */
.btn {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1e40af;
}

.btn-outline {
  background: transparent;
  border: 1px solid #2563eb;
  color: #2563eb;
}

.btn-outline:hover {
  background: #2563eb;
  color: #ffffff;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

/* ================= GRID ================= */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* ================= CARD ================= */
.career-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.career-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 35px rgba(0,0,0,0.12);
}

/* ================= CARD HEADER ================= */
.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.career-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1e293b;
}

/* ================= STATUS ================= */
.career-status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e5e7eb;
  color: #374151;
  font-weight: 600;
}

.career-status.active {
  background: #dcfce7;
  color: #166534;
}

/* ================= BODY ================= */
.career-body p {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 12px;
}

/* ================= INFO ================= */
.career-info {
  display: flex;
  gap: 8px;
}

.info-badge {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1e40af;
  font-weight: 500;
}

/* ================= ACTIONS ================= */
.career-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

/* ================= LOADING ================= */
.loading-spinner {
  text-align: center;
  margin-top: 60px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  margin: 0 auto 12px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  font-size: 14px;
  color: #6b7280;
}

/* ================= EMPTY STATE ================= */
.empty-state {
  text-align: center;
  margin-top: 80px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state h3 {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.empty-state p {
  margin: 8px 0 20px;
  font-size: 14px;
  color: #6b7280;
}

/* ================= ERROR ================= */
.error-message {
  margin-top: 20px;
  padding: 12px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .career-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
`]
})
export class CareerListComponent implements OnInit {
  private careerService = inject(CareerService);

  careers: Career[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCareers();
  }

  private loadCareers(): void {
    this.loading = true;
    this.careerService.getAll().subscribe({
      next: (careers) => {
        this.careers = careers;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las carreras';
        this.loading = false;
      }
    });
  }

  deleteCareer(career: Career): void {
    if (confirm(`¿Eliminar la carrera "${career.name}"?`)) {
      this.careerService.delete(career.id).subscribe({
        next: () => {
          this.careers = this.careers.filter(c => c.id !== career.id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar la carrera';
        }
      });
    }
  }
}