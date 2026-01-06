import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod, Career, CareerPeriod } from '../../../../core/models';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
// added: Angular Material imports
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CareerService } from '@core/services/career.service';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  // added: Material modules to imports
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatCheckboxModule],
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
            <span class="info-value">
              <span class="badge" [class.active]="period.status === 'Activo'">{{ period.status }}</span>
            </span>
          </div>
        </div>
        <div class="period-description" *ngIf="period.description">
          <!-- ADDED ICON TO TITLE -->
          <h3 class="desc-title"><i class="icon icon-info"></i> Descripción</h3>
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
          <!-- CHANGED: add headline-glow class for animated gradient headline -->
          <h2 class="headline-glow"><i class="icon icon-graduation"></i> Carreras Asociadas</h2>
          <div class="career-stats">
            <span class="stat-badge dual">
              {{ getDualCareersCount() }} Duales
            </span>
            <span class="stat-badge traditional">
              {{ getTraditionalCareersCount() }} Tradicionales
            </span>
          </div>

          <!-- NEW: Reassign button appears when there are careers -->
          <button
            *ngIf="careers.length > 0"
            type="button"
            class="btn btn-outline"
            (click)="openAssignModal(true)"
          >
            <i class="icon icon-edit"></i> Reasignar Carreras
          </button>
        </div>

        <div class="careers-grid" *ngIf="careers.length > 0">
          <div class="career-card" *ngFor="let career of careers">
            <!-- NEW: decorative corner ribbon for Dual/Tradicional -->
            <div class="card-ribbon" [class.dual]="career.isDual === 'DUAL'">
              {{ career.isDual === 'DUAL' ? 'DUAL' : 'TRAD' }}
            </div>

            <div class="career-header">
              <div class="career-icon">
                <!-- CHANGED: use explicit comparison to 'DUAL' -->
                <i
                  class="icon"
                  [class.icon-graduation]="career.isDual === 'DUAL'"
                  [class.icon-book]="career.isDual !== 'DUAL'"
                ></i>
              </div>
              <div class="career-info">
                <h3>{{ career.name }}</h3>
                <!-- already using 'DUAL' comparison here -->
                <span class="career-type" [class.dual]="career.isDual === 'DUAL'">
                  {{ career.isDual === 'DUAL' ? 'Carrera Dual' : 'Carrera Tradicional' }}
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

                <!-- CHANGED: explicit 'DUAL' comparison -->
                <div
                  class="formation-badge"
                  *ngIf="career.isDual === 'DUAL'"
                  [class.dual]="career.isDual === 'DUAL'"
                >
                  <span class="badge-icon"><i class="icon icon-graduation"></i></span>
                  <span class="badge-text">Prácticas Formación Dual</span>
                </div>

                <!-- CHANGED: explicit non-DUAL condition -->
                <div class="formation-badge prepro" *ngIf="career.isDual !== 'DUAL'">
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
          <button type="button" class="btn btn-primary" (click)="openAssignModal()">
            Asignar Primera Carrera
          </button>
        </div>
      </div>

      <!-- removed: custom modal/backdrop -->
      <!-- Modal Asignar Carreras (Angular Material) -->
      <ng-template #assignCareersDialog>
        <h2 mat-dialog-title>Asignar Carreras al Periodo</h2>
        <form [formGroup]="assignForm" (ngSubmit)="assignCareers()">
          <mat-dialog-content>
            <label class="info-label">Seleccione carreras existentes</label>

            <!-- NEW: attention hint when no selection -->
            <div
              class="select-hint"
              *ngIf="(assignForm.get('selectedCareerIds')?.value?.length ?? 0) === 0"
            >
              <i class="icon icon-warning"></i>
              <span>No hay carreras seleccionadas. Elija al menos una.</span>
            </div>

            <div
              class="checkbox-list"
              [class.empty]="(assignForm.get('selectedCareerIds')?.value?.length ?? 0) === 0"
            >
              <div class="checkbox-item" *ngFor="let c of availableCareers">
                <mat-checkbox
                  [checked]="isSelected(c.id)"
                  (change)="toggleCareerSelection(c.id, $event.checked)"
                >
                  {{ c.name }}
                </mat-checkbox>
              </div>
            </div>
          </mat-dialog-content>

          <mat-dialog-actions align="end">
            <button type="button" mat-stroked-button (click)="closeAssignModal()">Cancelar</button>
            <button
              type="submit"
              mat-flat-button
              color="primary"
              [disabled]="(assignForm.get('selectedCareerIds')?.value?.length ?? 0) === 0"
            >
              Asignar
            </button>
          </mat-dialog-actions>
        </form>
      </ng-template>

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
.period-careers-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 32px 24px; 
  min-height: 100vh; 
  background: #f1f5f9; 
}

/* Header adjustments to avoid overlap */
.header-content { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 24px; 
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
  gap: 12px;                  /* NEW: spacing between title and status */
}

/* Period status badge */
.period-status { 
  padding: 6px 12px; 
  border-radius: 999px; 
  font-weight: 600; 
  background: #d1fae5; 
  color: #065f46; 
  white-space: nowrap;        /* NEW: prevent wrapping inside badge */
}

/* Period info card and responsive grid */
.period-info-card { 
  background: #ffffff; 
  border-radius: 14px; 
  padding: 24px; 
  box-shadow: 0 12px 24px rgba(0,0,0,0.08); 
  margin-bottom: 24px; 
}

.info-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));  /* NEW: auto-fit responsive */
  gap: 16px; 
  margin-bottom: 16px; 
}

/* Section header (title, stats, actions) */
.section-header { 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
  gap: 12px; 
}

/* Stats badges styling */
.career-stats { 
  display: flex; 
  flex-wrap: wrap;            /* NEW: wrap on small screens */
  gap: 8px; 
}

.stat-badge { 
  display: inline-flex; 
  align-items: center; 
  padding: 6px 10px; 
  border-radius: 999px; 
  font-size: 12px; 
  font-weight: 600; 
}

.stat-badge.dual { 
  background: #eff6ff; 
  color: #1e40af; 
  border: 1px solid #cbd5f5; 
}

.stat-badge.traditional { 
  background: #fef3c7; 
  color: #92400e; 
  border: 1px solid #fcd34d; 
}

/* Careers grid responsive */
.careers-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* NEW: smoother responsive grid */
  gap: 24px; 
}

/* Career card */
.career-card { 
  background: #ffffff; 
  border-radius: 14px; 
  padding: 24px; 
  box-shadow: 0 12px 24px rgba(0,0,0,0.08); 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  transition: all 0.3s ease; 
}

/* Header inside card: wrap and spacing */
.career-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 16px; 
  gap: 12px;                 /* NEW: spacing between pieces */
  flex-wrap: wrap;           /* NEW: wrap to avoid overlap */
}

.career-header h3 { 
  font-size: 18px; 
  font-weight: 700; 
  margin: 0; 
  color: #0f172a; 
  overflow-wrap: anywhere;   /* NEW: handle very long names */
}

.career-info { 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
}

.career-type.dual { 
  color: #2563eb; 
  font-weight: 600; 
}

/* NEW: explicit status badge style */
.status-badge { 
  padding: 4px 10px; 
  border-radius: 999px; 
  font-size: 12px; 
  font-weight: 700; 
  background: #e5e7eb; 
  color: #111827; 
  white-space: nowrap;        /* prevent wrapping */
}

.status-badge.active { 
  background: #d1fae5; 
  color: #065f46; 
}

/* Description and formation types responsiveness */
.career-body p { 
  font-size: 14px; 
  color: #475569; 
  margin-bottom: 12px; 
  overflow-wrap: anywhere;    /* NEW: avoid overflow on mobile */
}

.formation-types { 
  display: flex; 
  flex-wrap: wrap;            /* NEW: wrap badges if needed */
  gap: 8px; 
}

/* Actions row */
.career-actions { 
  display: flex; 
  justify-content: flex-end; 
  margin-top: 12px; 
  gap: 8px; 
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
}

/* Buttons */
.btn { 
  padding: 6px 12px; 
  border-radius: 8px; 
  font-size: 13px; 
  font-weight: 600; 
  border: none; 
  cursor: pointer; 
  transition: all 0.25s ease; 
  text-decoration: none; 
  display: inline-flex; 
  align-items: center; 
  gap: 6px; 
}

/* Dialog: keep content scrollable on small screens */
.checkbox-list { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  max-height: 50vh; 
  overflow-y: auto; 
  /* NEW: smooth visual transition when toggling empty state */
  transition: box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

/* NEW: prominent hint shown when no selection */
.select-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fef2f2;      /* soft red background */
  color: #991b1b;           /* dark red text */
  border-left: 4px solid #ef4444; /* accent bar */
  margin-bottom: 8px;
  font-weight: 600;
}

/* NEW: attention-grabbing style when no checkbox selected */
.checkbox-list.empty {
  border: 2px dashed #ef4444;
  background: #fff5f5;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset;
  animation: attentionPulse 1.8s ease-in-out infinite;
  border-radius: 8px;
  padding: 8px;
}

/* NEW: subtle pulsing effect to draw attention */
@keyframes attentionPulse {
  0%   { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset; }
  50%  { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25) inset; }
  100% { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset; }
}


/* Period info card: more vivid look */
.period-info-card { 
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

/* Each info item: horizontal layout with 2em separation */
.info-item {
  display: flex;
  align-items: center;
  gap: 2em;                 /* REQUIRED: 2em space between label and value */
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

/* Label with icon */
.info-label {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

/* Icon circle + emoji fallback (works even without icon font) */
.info-label .icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
  /* CHANGED: make the emoji/glyph larger to fill the circle */
  font-size: 22px;
  line-height: 1;
}

/* Emoji fallbacks */
.info-label .icon-calendar::before { content: '📅'; }
.info-label .icon-graduation::before { content: '🎓'; }
.info-label .icon-chart::before { content: '📊'; }
.desc-title .icon-info::before { content: 'ℹ️'; }

/* Color themes for icon circles */
.info-label .icon-calendar { background: #e0f2fe; color: #075985; }
.info-label .icon-graduation { background: #ede9fe; color: #6b21a8; }
.info-label .icon-chart { background: #d1fae5; color: #065f46; }
.desc-title .icon-info { background: #fef3c7; color: #92400e; }

/* Value style */
.info-value {
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.02em;
}

/* Description title styling */
.desc-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  color: #0f172a;
}

.career-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
  }
  
  /* inner icon holder + emoji fallback */
  .career-icon .icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* CHANGED: increase glyph size so it uses the full circle */
    font-size: 30px;
    line-height: 1;
  }
  
  /* Dual */
  .career-icon .icon-graduation {
    background: #e0f2fe;   /* light blue */
    color: #1e40af;        /* deep blue text */
  }
  .career-icon .icon-graduation::before { content: '🎓'; }
  
  /* Tradicional */
  .career-icon .icon-book {
    background: #fef3c7;   /* light amber */
    color: #92400e;        /* brown text */
  }
  .career-icon .icon-book::before { content: '📘'; }

.careers-section {
  position: relative;
  padding-top: 16px;
}
.careers-section::before,
.careers-section::after {
  content: '';
  position: absolute;
  inset: -40px -20px auto -20px;
  height: 220px;
  z-index: 0;
  filter: blur(30px);
  opacity: 0.8;
  pointer-events: none;
}
.careers-section::before {
  background: radial-gradient(500px 140px at 10% 30%, #c7d2fe55, transparent 60%),
              radial-gradient(400px 120px at 85% 20%, #fed7aa55, transparent 60%);
}
.careers-section::after {
  background: radial-gradient(320px 120px at 50% 0%, #a7f3d055, transparent 60%);
}

/* Animated gradient headline */
.section-header .headline-glow {
  background: linear-gradient(90deg, #0ea5e9, #a78bfa, #f59e0b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-shadow: 0 6px 24px rgba(167, 139, 250, 0.25);
  position: relative;
  z-index: 1;
  animation: shineTitle 6s ease-in-out infinite;
}
@keyframes shineTitle {
  0% { filter: drop-shadow(0 0 0 rgba(245,158,11,0.0)); }
  50% { filter: drop-shadow(0 6px 14px rgba(245,158,11,0.35)); }
  100% { filter: drop-shadow(0 0 0 rgba(245,158,11,0.0)); }
}

/* Glassmorphism cards + glow-on-hover */
.career-grid, .careers-grid { position: relative; z-index: 1; } /* keep above blobs */

.career-card {
  position: relative;                  /* CHANGED: allow ribbon placement */
  background: rgba(255, 255, 255, 0.75);  /* CHANGED: glass look */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.08);
  transform: translateY(0);
}
.career-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 40px rgba(2, 6, 23, 0.14);
  border-color: transparent;
  outline: 2px solid transparent;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9));
}
.career-card::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: linear-gradient(135deg, #93c5fd, #c4b5fd, #fcd34d);
}
.career-card:hover::after {
  opacity: 0.35;                        /* subtle glow border */
  mix-blend-mode: multiply;
}

/* NEW: corner ribbon to instantly tag card type */
.card-ribbon {
  position: absolute;
  top: 14px;
  right: -8px;
  background: linear-gradient(135deg, #f59e0b, #fcd34d);
  color: #111827;
  font-weight: 800;
  font-size: 11px;
  padding: 6px 10px;
  transform: rotate(10deg);
  border-radius: 8px 0 0 8px;
  box-shadow: 0 6px 16px rgba(2, 6, 23, 0.12);
}
.card-ribbon.dual {
  background: linear-gradient(135deg, #3b82f6, #a5b4fc);
  color: #0b1324;
}

/* Status badge slight glow for active */
.status-badge.active {
  box-shadow: 0 0 0 3px rgba(209, 250, 229, 0.6) inset;
}

/* Chips for formation types refined */
.formation-types .formation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.formation-types .formation-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(2, 6, 23, 0.08);
  background: #ffffff;
}

/* Buttons polished */
.btn-primary {
  background: linear-gradient(90deg, #3b82f6, #a78bfa);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(59, 130, 246, 0.20);
}
.btn-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.btn.btn-outline {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.btn.btn-outline:hover {
  border-color: #93c5fd;
  box-shadow: 0 8px 18px rgba(147, 197, 253, 0.25);
}

/* Empty state: halo + bounce-in */
.empty-state {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}
.empty-state::before {
  content: '';
  position: absolute;
  inset: -60px -30px auto -30px;
  height: 260px;
  background: radial-gradient(420px 150px at 10% 35%, #c7d2fe55, transparent 60%),
              radial-gradient(320px 120px at 85% 25%, #fecdd355, transparent 60%);
  filter: blur(25px);
  pointer-events: none;
}
.empty-state h3 {
  animation: gentlePop 600ms ease-out both;
}
@keyframes gentlePop {
  from { transform: scale(0.98); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

/* Keep existing icon/labels/styles below */
.period-careers-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background: #f1f5f9;
}

/* Header adjustments to avoid overlap */
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
  gap: 12px;                  /* NEW: spacing between title and status */
}

/* Period status badge */
.period-status {
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
  white-space: nowrap;        /* NEW: prevent wrapping inside badge */
}

/* Period info card and responsive grid */
.period-info-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));  /* NEW: auto-fit responsive */
  gap: 16px;
  margin-bottom: 16px;
}

/* Section header (title, stats, actions) */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
  gap: 12px;
}

/* Stats badges styling */
.career-stats {
  display: flex;
  flex-wrap: wrap;            /* NEW: wrap on small screens */
  gap: 8px;
}

.stat-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.stat-badge.dual {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #cbd5f5;
}

.stat-badge.traditional {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

/* Careers grid responsive */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* NEW: smoother responsive grid */
  gap: 24px;
}

/* Career card */
.career-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

/* Header inside card: wrap and spacing */
.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;                 /* NEW: spacing between pieces */
  flex-wrap: wrap;           /* NEW: wrap to avoid overlap */
}

.career-header h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
  overflow-wrap: anywhere;   /* NEW: handle very long names */
}

.career-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.career-type.dual {
  color: #2563eb;
  font-weight: 600;
}

/* NEW: explicit status badge style */
.status-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e5e7eb;
  color: #111827;
  white-space: nowrap;        /* prevent wrapping */
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

/* Description and formation types responsiveness */
.career-body p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 12px;
  overflow-wrap: anywhere;    /* NEW: avoid overflow on mobile */
}

.formation-types {
  display: flex;
  flex-wrap: wrap;            /* NEW: wrap badges if needed */
  gap: 8px;
}

/* Actions row */
.career-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 8px;
  flex-wrap: wrap;            /* NEW: wrap to avoid overlap */
}

/* Buttons */
.btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Dialog: keep content scrollable on small screens */
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 50vh;
  overflow-y: auto;
  /* NEW: smooth visual transition when toggling empty state */
  transition: box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

/* NEW: prominent hint shown when no selection */
.select-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fef2f2;      /* soft red background */
  color: #991b1b;           /* dark red text */
  border-left: 4px solid #ef4444; /* accent bar */
  margin-bottom: 8px;
  font-weight: 600;
}

/* NEW: attention-grabbing style when no checkbox selected */
.checkbox-list.empty {
  border: 2px dashed #ef4444;
  background: #fff5f5;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset;
  animation: attentionPulse 1.8s ease-in-out infinite;
  border-radius: 8px;
  padding: 8px;
}

/* NEW: subtle pulsing effect to draw attention */
@keyframes attentionPulse {
  0%   { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset; }
  50%  { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.25) inset; }
  100% { box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) inset; }
}


/* Period info card: more vivid look */
.period-info-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.06);
  margin-bottom: 24px;
}

/* Each info item: horizontal layout with 2em separation */
.info-item {
  display: flex;
  align-items: center;
  gap: 2em;                 /* REQUIRED: 2em space between label and value */
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.08);
}

/* Label with icon */
.info-label {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

/* Icon circle + emoji fallback (works even without icon font) */
.info-label .icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
  /* CHANGED: make the emoji/glyph larger to fill the circle */
  font-size: 22px;
  line-height: 1;
}

/* Emoji fallbacks */
.info-label .icon-calendar::before { content: '📅'; }
.info-label .icon-graduation::before { content: '🎓'; }
.info-label .icon-chart::before { content: '📊'; }
.desc-title .icon-info::before { content: 'ℹ️'; }

/* Color themes for icon circles */
.info-label .icon-calendar { background: #e0f2fe; color: #075985; }
.info-label .icon-graduation { background: #ede9fe; color: #6b21a8; }
.info-label .icon-chart { background: #d1fae5; color: #065f46; }
.desc-title .icon-info { background: #fef3c7; color: #92400e; }

/* Value style */
.info-value {
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.02em;
}

/* Description title styling */
.desc-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  color: #0f172a;
}

.career-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
  }
  
  /* inner icon holder + emoji fallback */
  .career-icon .icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    line-height: 1;
  }
  
  /* Dual */
  .career-icon .icon-graduation {
    background: #e0f2fe;   /* light blue */
    color: #1e40af;        /* deep blue text */
  }
  .career-icon .icon-graduation::before { content: '🎓'; }
  
  /* Tradicional */
  .career-icon .icon-book {
    background: #fef3c7;   /* light amber */
    color: #92400e;        /* brown text */
  }
  .career-icon .icon-book::before { content: '📘'; }



  `]})
  export class PeriodCareersComponent implements OnInit {
    private careerService = inject(CareerService);
    private periodService = inject(PeriodService);
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    // added: Angular Material dialog API
    private dialog = inject(MatDialog);
    private dialogRef?: MatDialogRef<any>;
    @ViewChild('assignCareersDialog') assignCareersDialog!: TemplateRef<any>;
  
    period?: CareerPeriod;
    careers: Career[] = [];
    loading = true;
    errorMessage = '';
    periodId?: number;
  
  
  
    assignForm = this.fb.group({
      selectedCareerIds: this.fb.control<number[]>([])
    });
    availableCareers: Career[] = [];
  
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
  
    // UPDATED: openAssignModal now supports reassign to pre-select current careers
    openAssignModal(reassign: boolean = false): void {
      // If reassigning, pre-select already assigned careers
      const control = this.assignForm.get('selectedCareerIds') as FormControl<number[]>;
      if (reassign) {
        const preselected = (this.careers ?? []).map(c => c.id);
        control.setValue(preselected);
        control.markAsPristine();
      } else {
        // first assignment: start empty
        this.assignForm.reset({ selectedCareerIds: [] });
      }
  
      this.loadAvailableCareers();
      // UPDATED: responsive dialog width
      this.dialogRef = this.dialog.open(this.assignCareersDialog, { 
        width: '640px', 
        maxWidth: '90vw'         // NEW: ensure dialog fits small screens
      });
  
      this.dialogRef.afterClosed().subscribe(() => {
        // always reset after closing
        this.assignForm.reset({ selectedCareerIds: [] });
        this.dialogRef = undefined;
      });
    }
  
    // close dialog
    closeAssignModal(): void {
      this.dialogRef?.close();
    }
  
    private loadAvailableCareers(): void {
  
      this.careerService.getAll().subscribe({ next: (list) => this.availableCareers = list });
    }
  
    // updated: accept boolean from MatCheckbox change event
    toggleCareerSelection(careerId: number, checked: boolean): void {
      const control = this.assignForm.get('selectedCareerIds') as FormControl<number[]>;
      const current = control.value ?? [];
      const next = checked ? (current.includes(careerId) ? current : [...current, careerId]) : current.filter(id => id !== careerId);
      control.setValue(next);
      control.markAsDirty();
    }
  
    isSelected(id: number): boolean {
      const control = this.assignForm.get('selectedCareerIds') as FormControl<number[]>;
      return (control.value ?? []).includes(id);
    }
  
    assignCareers(): void {
      if (!this.periodId) return;
      const ids = (this.assignForm.get('selectedCareerIds') as FormControl<number[]>).value ?? [];
      if (ids.length === 0) return;
      console.log('Assigning careers:', ids);
  
  
      this.periodService.assignCareersToPeriod(this.periodId, ids).subscribe({
        next: () => { this.dialogRef?.close(); this.loadData(); },
        error: (err) => { this.errorMessage = 'Error al asignar carreras'; console.error(err); }
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
