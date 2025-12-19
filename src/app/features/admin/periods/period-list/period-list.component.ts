import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-period-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  template: `
    <div class="period-list">
      <div class="list-header">
        <div>
          <h1>Periodos Académicos</h1>
          <p>Gestión de periodos del sistema</p>
        </div>
        <a routerLink="/admin/periods/new" class="btn btn-primary">
          <span>➕</span>
          <span>Nuevo Periodo</span>
        </a>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando periodos...</p>
      </div>

      <div class="periods-grid" *ngIf="!loading && periods.length > 0">
        <div class="period-card" *ngFor="let period of periods">
          <div class="period-header">
            <h3>{{ period.name }}</h3>
            <span class="period-status" [class.active]="period.status === 'Activo'">
              {{ period.status }}
            </span>
          </div>

          <div class="period-body">
            <p class="period-description" *ngIf="period.description">
              {{ period.description }}
            </p>

            <div class="period-dates">
              <div class="date-item">
                <span class="date-label">Inicio:</span>
                <span class="date-value">{{ period.startDate | dateFormat }}</span>
              </div>
              <div class="date-item">
                <span class="date-label">Fin:</span>
                <span class="date-value">{{ period.endDate | dateFormat }}</span>
              </div>
            </div>

            <div class="period-stats" *ngIf="period.careers">
              <span class="stat-item">
                🎓 {{ period.careers.length }} carreras
              </span>
            </div>
          </div>

          <div class="period-actions">
            <a [routerLink]="['/admin/periods', period.id, 'careers']" class="btn btn-sm btn-outline">
              Ver Carreras
            </a>
            <a [routerLink]="['/admin/periods', period.id, 'edit']" class="btn btn-sm btn-outline">
              ✏️ Editar
            </a>
            <button class="btn btn-sm btn-danger" (click)="deletePeriod(period)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && periods.length === 0">
        <div class="empty-icon">📅</div>
        <h3>No hay periodos académicos</h3>
        <p>Comienza creando el primer periodo académico</p>
        <a routerLink="/admin/periods/new" class="btn btn-primary">
          Crear Primer Periodo
        </a>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.period-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background: #f1f5f9;
}

/* ================= HEADER ================= */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.list-header h1 {
  font-size: 30px;
  color: #0f172a;
  margin-bottom: 6px;
  font-weight: 700;
}

.list-header p {
  color: #475569;
  font-size: 15px;
  margin: 0;
}

/* ================= GRID ================= */
.periods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

/* ================= CARD ================= */
.period-card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.period-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(0,0,0,0.15);
}

/* ================= CARD HEADER ================= */
.period-header {
  padding: 22px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.period-header h3 {
  font-size: 18px;
  color: #0f172a;
  margin: 0;
  font-weight: 700;
  flex: 1;
}

/* ================= STATUS ================= */
.period-status {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e5e7eb;
  color: #475569;
  white-space: nowrap;
}

.period-status.active {
  background: #dcfce7;
  color: #166534;
}

/* ================= BODY ================= */
.period-body {
  padding: 20px 24px;
}

.period-description {
  color: #475569;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.6;
}

/* ================= DATES ================= */
.period-dates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.date-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.date-label {
  color: #64748b;
  font-weight: 600;
}

.date-value {
  color: #0f172a;
  font-weight: 700;
}

/* ================= STATS ================= */
.period-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 14px;
  color: #475569;
  font-weight: 600;
}

/* ================= ACTIONS ================= */
.period-actions {
  padding: 16px 24px;
  background: #f8fafc;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-top: 1px solid #e5e7eb;
}

/* ================= EMPTY ================= */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #0f172a;
  margin-bottom: 8px;
  font-weight: 700;
}

.empty-state p {
  color: #475569;
  margin-bottom: 24px;
}

/* ================= LOADING ================= */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: #ffffff;
  border-radius: 14px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner p {
  margin-top: 16px;
  color: #475569;
  font-size: 14px;
}

/* ================= ERROR ================= */
.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  border: 1px solid #fecaca;
  font-weight: 600;
}

/* ================= ANIM ================= */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .list-header .btn {
    width: 100%;
  }

  .periods-grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class PeriodListComponent implements OnInit {
  private periodService = inject(PeriodService);

  periods: AcademicPeriod[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPeriods();
  }

  private loadPeriods(): void {
    this.loading = true;
    this.errorMessage = '';

    this.periodService.getAll().subscribe({
      next: (periods) => {
        this.periods = periods;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los periodos';
        this.loading = false;
        console.error('Error loading periods:', error);
      }
    });
  }

  deletePeriod(period: AcademicPeriod): void {
    if (confirm(`¿Está seguro de eliminar el periodo "${period.name}"?`)) {
      this.periodService.delete(period.id).subscribe({
        next: () => {
          this.periods = this.periods.filter(p => p.id !== period.id);
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el periodo';
          console.error('Error deleting period:', error);
        }
      });
    }
  }
}