import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod, Career } from '../../../../core/models';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="period-careers-container">
      <div class="header">
        <a routerLink="/admin/periods" class="back-link">← Volver a Periodos</a>
        <div class="header-content" *ngIf="period">
          <div>
            <h1>{{ period.name }}</h1>
            <p>Carreras asociadas al periodo académico</p>
          </div>
          <span class="period-status" [class.active]="period.status === 'Activo'">
            {{ period.status }}
          </span>
        </div>
      </div>

      <!-- Información del Periodo -->
      <div class="period-info-card" *ngIf="period">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">📅 Fecha de Inicio</span>
            <span class="info-value">{{ period.startDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📅 Fecha de Fin</span>
            <span class="info-value">{{ period.endDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎓 Total Carreras</span>
            <span class="info-value">{{ careers.length }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📊 Estado</span>
            <span class="badge" [class.active]="period.status === 'Activo'">
              {{ period.status }}
            </span>
          </div>
        </div>
        <div class="period-description" *ngIf="period.description">
          <h3>Descripción</h3>
          <p>{{ period.description }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- Carreras del Periodo -->
      <div class="careers-section" *ngIf="!loading">
        <div class="section-header">
          <h2>🎓 Carreras Asociadas</h2>
          <div class="career-stats">
            <span class="stat-badge dual">
              {{ getDualCareersCount() }} Duales
            </span>
            <span class="stat-badge traditional">
              {{ getTraditionalCareersCount() }} Tradicionales
            </span>
          </div>
        </div>

        <div class="careers-grid" *ngIf="careers.length > 0">
          <div class="career-card" *ngFor="let career of careers">
            <div class="career-header">
              <div class="career-icon">
                {{ career.isDual ? '🎓' : '📚' }}
              </div>
              <div class="career-info">
                <h3>{{ career.name }}</h3>
                <span class="career-type" [class.dual]="career.isDual">
                  {{ career.isDual ? 'Carrera Dual' : 'Carrera Tradicional' }}
                </span>
              </div>
              <span class="status-badge" [class.active]="career.status === 'Activo'">
                {{ career.status }}
              </span>
            </div>

            <div class="career-body" *ngIf="career.description">
              <p class="career-description">{{ career.description }}</p>
            </div>

            <div class="career-details">
              <h4>Tipos de Formación Disponibles:</h4>
              <div class="formation-types">
                <div class="formation-badge vinculation">
                  <span class="badge-icon">🤝</span>
                  <span class="badge-text">Vinculación (160h)</span>
                </div>
                <div class="formation-badge" *ngIf="career.isDual" [class.dual]="career.isDual">
                  <span class="badge-icon">🎓</span>
                  <span class="badge-text">Prácticas Formación Dual</span>
                </div>
                <div class="formation-badge prepro" *ngIf="!career.isDual">
                  <span class="badge-icon">💼</span>
                  <span class="badge-text">Prácticas Preprofesionales</span>
                </div>
              </div>
            </div>

            <div class="career-actions">
              <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
                ✏️ Editar Carrera
              </a>
            </div>
          </div>
        </div>

        <!-- Estado Vacío -->
        <div class="empty-state" *ngIf="careers.length === 0">
          <div class="empty-icon">🎓</div>
          <h3>No hay carreras asociadas</h3>
          <p>Este periodo académico no tiene carreras registradas</p>
          <a routerLink="/admin/careers/new" class="btn btn-primary">
            Crear Primera Carrera
          </a>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="stats-section" *ngIf="!loading && careers.length > 0">
        <h2>📊 Resumen del Periodo</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Duales</div>
              <div class="stat-value">{{ getDualCareersCount() }}</div>
              <div class="stat-description">Prácticas formativas obligatorias</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Tradicionales</div>
              <div class="stat-value">{{ getTraditionalCareersCount() }}</div>
              <div class="stat-description">Vinculación + Preprofesionales</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Activas</div>
              <div class="stat-value">{{ getActiveCareersCount() }}</div>
              <div class="stat-description">En funcionamiento actual</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">Total Carreras</div>
              <div class="stat-value">{{ careers.length }}</div>
              <div class="stat-description">Registradas en el periodo</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.career-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background: #f1f5f9; /* gris claro */
}

/* ================= HEADER ================= */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.list-header h1 {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.list-header p {
  font-size: 15px;
  color: #475569;
  margin: 0;
}

/* ================= BOTONES ================= */
.btn {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.25s ease;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-outline {
  background: #ffffff;
  border: 1px solid #cbd5f5;
  color: #1e40af;
}

.btn-outline:hover {
  background: #eff6ff;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-sm {
  padding: 6px 14px;
  font-size: 13px;
}

/* ================= LOADING ================= */
.loading-spinner {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= GRID ================= */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

/* ================= CARD ================= */
.career-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.career-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 32px rgba(0,0,0,0.12);
}

/* ================= CARD HEADER ================= */
.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.career-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* ================= ESTADO ================= */
.career-status {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
}

.career-status.active {
  background: #d1fae5;
  color: #065f46;
}

/* ================= BODY ================= */
.career-body p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 16px;
  line-height: 1.5;
}

.career-info {
  display: flex;
  gap: 8px;
}

.info-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #e0e7ff;
  color: #3730a3;
}

/* ================= ACTIONS ================= */
.career-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* ================= EMPTY STATE ================= */
.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  color: #0f172a;
  font-weight: 700;
}

.empty-state p {
  color: #475569;
  margin-bottom: 20px;
}

/* ================= ERROR ================= */
.error-message {
  margin-top: 24px;
  padding: 14px 18px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    gap: 16px;
  }

  .career-actions {
    flex-direction: column;
  }
}
`]

})
export class PeriodCareersComponent implements OnInit {
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);

  period?: AcademicPeriod;
  careers: Career[] = [];
  loading = true;
  errorMessage = '';
  periodId?: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.periodId = +params['id'];
        this.loadData();
      }
    });
  }

  private loadData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Cargar periodo
    this.periodService.getById(this.periodId!).subscribe({
      next: (period) => {
        this.period = period;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el periodo';
        console.error('Error:', error);
      }
    });

    // Cargar carreras del periodo
    this.periodService.getCareers(this.periodId!).subscribe({
      next: (careers) => {
        this.careers = careers;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las carreras';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getDualCareersCount(): number {
    return this.careers.filter(c => c.isDual).length;
  }

  getTraditionalCareersCount(): number {
    return this.careers.filter(c => !c.isDual).length;
  }

  getActiveCareersCount(): number {
    return this.careers.filter(c => c.status === 'Activo').length;
  }
}