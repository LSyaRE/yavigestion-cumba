import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod, Career, CareerPeriod } from '../../../../core/models';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="period-careers-container">
      <!-- Header -->
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
            <span class="info-label"><i class="icon icon-calendar"></i> Fecha de Inicio</span>
            <span class="info-value">{{ period.startDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="icon icon-calendar"></i> Fecha de Fin</span>
            <span class="info-value">{{ period.endDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="icon icon-graduation"></i> Total Carreras</span>
            <span class="info-value">{{ careers.length }}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="icon icon-chart"></i> Estado</span>
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
          <h2><i class="icon icon-graduation"></i> Carreras Asociadas</h2>
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
                <i class="icon" [class.icon-graduation]="career.isDual" [class.icon-book]="!career.isDual"></i>
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
                  <span class="badge-icon"><i class="icon icon-handshake"></i></span>
                  <span class="badge-text">Vinculación (160h)</span>
                </div>
                <div class="formation-badge" *ngIf="career.isDual" [class.dual]="career.isDual">
                  <span class="badge-icon"><i class="icon icon-graduation"></i></span>
                  <span class="badge-text">Prácticas Formación Dual</span>
                </div>
                <div class="formation-badge prepro" *ngIf="!career.isDual">
                  <span class="badge-icon"><i class="icon icon-briefcase"></i></span>
                  <span class="badge-text">Prácticas Preprofesionales</span>
                </div>
              </div>
            </div>

            <div class="career-actions">
              <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
                <i class="icon icon-edit"></i> Editar Carrera
              </a>
            </div>
          </div>
        </div>

        <!-- Estado Vacío -->
        <div class="empty-state" *ngIf="careers.length === 0">
          <div class="empty-icon"><i class="icon icon-graduation"></i></div>
          <h3>No hay carreras asociadas</h3>
          <p>Este periodo académico no tiene carreras registradas</p>
          <a routerLink="/admin/careers/new" class="btn btn-primary">
            Crear Primera Carrera
          </a>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="stats-section" *ngIf="!loading && careers.length > 0">
        <h2><i class="icon icon-chart"></i> Resumen del Periodo</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><i class="icon icon-graduation"></i></div>
            <div class="stat-content">
              <div class="stat-label">Carreras Duales</div>
              <div class="stat-value">{{ getDualCareersCount() }}</div>
              <div class="stat-description">Prácticas formativas obligatorias</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><i class="icon icon-book"></i></div>
            <div class="stat-content">
              <div class="stat-label">Carreras Tradicionales</div>
              <div class="stat-value">{{ getTraditionalCareersCount() }}</div>
              <div class="stat-description">Vinculación + Preprofesionales</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><i class="icon icon-check"></i></div>
            <div class="stat-content">
              <div class="stat-label">Carreras Activas</div>
              <div class="stat-value">{{ getActiveCareersCount() }}</div>
              <div class="stat-description">En funcionamiento actual</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><i class="icon icon-chart"></i></div>
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
        <i class="icon icon-warning"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
/* Contenedor general */
.period-careers-container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; min-height: 100vh; background: #f1f5f9; }
.back-link { color: #2563eb; text-decoration: none; font-size: 14px; font-weight: 600; margin-bottom: 12px; display: inline-block; }
.back-link:hover { text-decoration: underline; }
.header-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.period-status { padding: 6px 12px; border-radius: 999px; font-weight: 600; background: #d1fae5; color: #065f46; }
.period-status.active { background: #d1fae5; color: #065f46; }
.period-info-card { background: #ffffff; border-radius: 14px; padding: 24px; box-shadow: 0 12px 24px rgba(0,0,0,0.08); margin-bottom: 24px; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
.info-item { display: flex; flex-direction: column; }
.info-label { font-weight: 600; color: #374151; margin-bottom: 4px; }
.info-value { color: #111827; font-weight: 500; }
.loading-spinner { text-align: center; padding: 80px 20px; }
.spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.careers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
.career-card { background: #ffffff; border-radius: 14px; padding: 24px; box-shadow: 0 12px 24px rgba(0,0,0,0.08); display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; }
.career-card:hover { transform: translateY(-6px); box-shadow: 0 18px 32px rgba(0,0,0,0.12); }
.career-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.career-header h3 { font-size: 18px; font-weight: 700; margin: 0; color: #0f172a; }
.career-info { display: flex; flex-direction: column; gap: 4px; }
.career-type.dual { color: #2563eb; font-weight: 600; }
.career-body p { font-size: 14px; color: #475569; margin-bottom: 12px; }
.career-actions { display: flex; justify-content: flex-end; margin-top: 12px; gap: 8px; }
.btn { padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.25s ease; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.btn-primary { background: #2563eb; color: #fff; }
.btn-primary:hover { background: #1d4ed8; }
.btn-outline { background: #fff; border: 1px solid #cbd5f5; color: #1e40af; }
.btn-outline:hover { background: #eff6ff; }
.empty-state { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-icon .icon { font-size: 64px; }
.error-message { margin-top: 24px; padding: 14px 18px; background: #fee2e2; color: #991b1b; border-radius: 10px; display: flex; align-items: center; gap: 8px; font-weight: 600; }

/* Icon styles */
.icon { display: inline-block; width: 1em; height: 1em; vertical-align: middle; }
.icon-calendar::before { content: '📅'; }
.icon-graduation::before { content: '🎓'; }
.icon-chart::before { content: '📊'; }
.icon-book::before { content: '📚'; }
.icon-handshake::before { content: '🤝'; }
.icon-briefcase::before { content: '💼'; }
.icon-edit::before { content: '✏️'; }
.icon-check::before { content: '✅'; }
.icon-warning::before { content: '⚠️'; }

@media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .career-actions { flex-direction: column; } }
  `]
})
export class PeriodCareersComponent implements OnInit {
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);

  period?: CareerPeriod;
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
    this.periodService.getCareerByPeriod(this.periodId!).subscribe({
      next: (period) => {
        this.period = period
        this.careers = period?.careers;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el periodo';
        console.error(error);
      }
    });




  }

  getDualCareersCount(): number {
    return this.period?.totalDual ?? 0;
  }

  getTraditionalCareersCount(): number {
    return this.period?.totalTraditional ?? 0;
  }

  getActiveCareersCount(): number {
    return this.careers.filter(c => c.status === 'Activo').length;
  }
}