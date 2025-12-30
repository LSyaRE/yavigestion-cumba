import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';

@Component({
  selector: 'app-internship-preprofessional',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="internship-container">
      <div class="header">
        <div class="header-content">
          <div class="icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="12" y="20" width="40" height="28" rx="4" stroke="currentColor" stroke-width="3"/>
              <path d="M20 16h24v4H20z" fill="currentColor"/>
              <path d="M28 32h8M28 40h8" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h1>Prácticas Preprofesionales</h1>
            <p>Prácticas complementarias para fortalecer tu perfil profesional</p>
          </div>
        </div>
      </div>

      <!-- Información -->
      <div class="info-card prepro">
        <h2>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M8 6h10M8 10h10M8 14h10M4 6h.01M4 10h.01M4 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Información de las Prácticas
        </h2>
        <p>Las prácticas preprofesionales son complementarias y te permiten aplicar conocimientos en un entorno real de trabajo.</p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="badge active">En Curso</span>
          </div>
          <div class="info-item">
            <span class="label">Tipo:</span>
            <span class="value">Complementarias</span>
          </div>
          <div class="info-item">
            <span class="label">Modalidad:</span>
            <span class="value">Presencial/Virtual</span>
          </div>
        </div>
      </div>

      <!-- Mi Empresa -->
      <div class="enterprise-section" *ngIf="hasEnterprise">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <rect x="3" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 5V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Mi Empresa de Prácticas
        </h2>
        <div class="enterprise-card">
          <div class="enterprise-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="28" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M14 10v4M34 10v4M8 20h32" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="enterprise-info">
            <h3>{{ enterpriseName }}</h3>
            <div class="enterprise-details">
              <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <path d="M7 13c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M7 3v4l3 2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ enterpriseAddress }}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <circle cx="7" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 11v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Tutor: {{ tutorName }}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M1 5l6 3 6-3" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ tutorEmail }}
              </span>
            </div>
          </div>
          <span class="status-badge active">Activo</span>
        </div>
      </div>

      <!-- Documentos Requeridos -->
      <div class="documents-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M7 3h8l4 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M15 3v4h4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Documentos Requeridos
        </h2>
        
        <div class="documents-grid">
          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M12 9h18M12 15h18M12 21h18M6 9h.01M6 15h.01M6 21h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <span class="doc-status pending">Pendiente</span>
            </div>
            <div class="doc-info">
              <h3>Carta de Presentación</h3>
              <p>Documento oficial de presentación ante la empresa</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M4 2h4l2 2v6H4V2z" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  PDF
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1"/>
                    <path d="M2 5h8" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Vencimiento: 15 días
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-primary btn-sm btn-block" (click)="generateDocument('carta-presentacion')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <path d="M3 2h6l2 2v6H3V2z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M9 2v2h2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Generar Documento
              </button>
            </div>
          </div>

          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M9 6h18l3 3v15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="doc-status pending">Pendiente</span>
            </div>
            <div class="doc-info">
              <h3>Convenio de Prácticas</h3>
              <p>Acuerdo tripartito: Estudiante - Empresa - Instituto</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M4 2h4l2 2v6H4V2z" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  PDF
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M3 8l2 2 4-4" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Requiere firma
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-outline btn-sm btn-block" disabled>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Disponible pronto
              </button>
            </div>
          </div>

          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="6" y="6" width="24" height="24" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M14 18l3 3 6-6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="doc-status in-progress">En Proceso</span>
            </div>
            <div class="doc-info">
              <h3>Plan de Actividades</h3>
              <p>Cronograma de actividades a desarrollar</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M4 2h4l2 2v6H4V2z" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Word/PDF
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <circle cx="6" cy="4" r="2" stroke="currentColor" stroke-width="1"/>
                    <path d="M3 9v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Aprobación del tutor
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-primary btn-sm btn-block" (click)="uploadDocument('plan-actividades')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <path d="M7 10V3M7 3L4 6M7 3l3 3M2 11h10" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Subir Documento
              </button>
            </div>
          </div>

          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M9 28l4-8 4 4 4-8M6 6h24v24H6V6z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="doc-status pending">Pendiente</span>
            </div>
            <div class="doc-info">
              <h3>Informes Mensuales</h3>
              <p>Reportes de progreso y actividades realizadas</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Mensual
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M3 5l2 2 4-4" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  0/3 entregados
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-outline btn-sm btn-block">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <path d="M3 2h6l2 2v6H3V2z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Crear Informe
              </button>
            </div>
          </div>

          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="12" stroke="currentColor" stroke-width="2"/>
                  <path d="M18 12v6l4 2" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="doc-status pending">Pendiente</span>
            </div>
            <div class="doc-info">
              <h3>Informe Final</h3>
              <p>Documento de cierre con evaluación y resultados</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M4 2h4l2 2v6H4V2z" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  PDF
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Al finalizar
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-outline btn-sm btn-block" disabled>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <rect x="4" y="2" width="6" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="7" cy="6" r="1" fill="currentColor"/>
                </svg>
                Bloqueado
              </button>
            </div>
          </div>

          <div class="document-card">
            <div class="doc-header">
              <div class="doc-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 6l-3 6h6l-3 6M18 30c6.627 0 12-5.373 12-12S24.627 6 18 6 6 11.373 6 18s5.373 12 12 12z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <span class="doc-status pending">Pendiente</span>
            </div>
            <div class="doc-info">
              <h3>Certificado de Prácticas</h3>
              <p>Certificado emitido por la empresa</p>
              <div class="doc-meta">
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <path d="M4 2h4l2 2v6H4V2z" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  PDF
                </span>
                <span class="meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 2px;">
                    <rect x="2" y="3" width="8" height="6" rx="1" stroke="currentColor" stroke-width="1"/>
                  </svg>
                  Emitido por empresa
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <button class="btn btn-outline btn-sm btn-block" disabled>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                Al finalizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Progreso General -->
      <div class="progress-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M11 3v8l5 3M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Progreso General
        </h2>
        
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-label">Documentos Completados</div>
            <div class="stat-value">{{ completedDocs }}/{{ totalDocs }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Horas Completadas</div>
            <div class="stat-value">{{ completedHours }}/{{ requiredHours }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Evaluaciones</div>
            <div class="stat-value">{{ evaluationsCount }}</div>
          </div>
        </div>

        <div class="progress-bar-section">
          <div class="progress-label">
            <span>Progreso Total</span>
            <span class="progress-percentage">{{ progressPercentage }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              [style.width.%]="progressPercentage"
              [class.low]="progressPercentage < 30"
              [class.medium]="progressPercentage >= 30 && progressPercentage < 70"
              [class.high]="progressPercentage >= 70"
            ></div>
          </div>
          <p class="progress-description">
            {{ getProgressMessage() }}
          </p>
        </div>
      </div>

      <!-- Próximos Pasos -->
      <div class="next-steps-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M11 7v4l3 2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Próximos Pasos
        </h2>
        <div class="steps-list">
          <div class="step-item" [class.completed]="step.completed" *ngFor="let step of nextSteps">
            <div class="step-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" *ngIf="step.completed">
                <circle cx="16" cy="16" r="14" fill="#10b981"/>
                <path d="M10 16l4 4 8-8" stroke="white" stroke-width="3"/>
              </svg>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" *ngIf="!step.completed">
                <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div class="step-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
              <span class="step-deadline" *ngIf="step.deadline">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="display: inline; vertical-align: middle; margin-right: 4px;">
                  <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1"/>
                  <path d="M2 5h8" stroke="currentColor" stroke-width="1"/>
                </svg>
                Fecha límite: {{ step.deadline }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recursos de Ayuda -->
      <div class="help-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M11 7v4M11 15v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ¿Necesitas Ayuda?
        </h2>
        <div class="help-cards">
          <div class="help-card">
            <div class="help-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M12 8h24v32H12V8z" stroke="currentColor" stroke-width="2"/>
                <path d="M18 16h12M18 24h12M18 32h8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Guía de Prácticas</h3>
            <p>Manual completo sobre el proceso</p>
            <button class="btn btn-outline btn-sm">Descargar PDF</button>
          </div>
          <div class="help-card">
            <div class="help-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" stroke-width="2"/>
                <path d="M8 18l16 10 16-10" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Contactar Coordinador</h3>
            <p>Resuelve tus dudas</p>
            <button class="btn btn-outline btn-sm">Enviar Mensaje</button>
          </div>
          <div class="help-card">
            <div class="help-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
                <path d="M24 16v8M24 32v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Preguntas Frecuentes</h3>
            <p>Respuestas rápidas</p>
            <button class="btn btn-outline btn-sm">Ver FAQ</button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    </div>
  `,
  styles: [`
    .internship-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      .header-content {
        display: flex;
        gap: 20px;
        align-items: center;

        .icon {
          color: #10b981;
        }

        h1 {
          font-size: 32px;
          color: #1f2937;
          font-weight: 700;
          margin-bottom: 4px;
        }

        p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }
      }
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      &.prepro {
        background: #ecfdf5;
        border: 2px solid #10b981;
      }

      h2 {
        font-size: 18px;
        color: #065f46;
        font-weight: 600;
        margin-bottom: 12px;
      }

      h2 svg {
        color: #065f46;
      }

      p {
        color: #065f46;
        margin-bottom: 16px;
        line-height: 1.6;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            font-size: 14px;
            color: #065f46;
            font-weight: 500;
          }

          .value {
            font-size: 14px;
            color: #064e3b;
            font-weight: 700;
          }

          .badge {
            padding: 6px 12px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;

            &.active {
              background: #6ee7b7;
              color: #064e3b;
            }
          }
        }
      }
    }

    .enterprise-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 20px;
      }

      h2 svg {
        color: #1f2937;
      }

      .enterprise-card {
        display: flex;
        gap: 20px;
        align-items: center;
        padding: 24px;
        background: #f9fafb;
        border: 2px solid #e5e7eb;
        border-radius: 12px;

        .enterprise-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .enterprise-info {
          flex: 1;

          h3 {
            font-size: 20px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 12px;
          }

          .enterprise-details {
            display: flex;
            flex-direction: column;
            gap: 6px;

            span {
              font-size: 14px;
              color: #6b7280;
            }

            span svg {
              color: #6b7280;
            }
          }
        }

        .status-badge {
          padding: 8px 16px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }
      }
    }

    .documents-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 24px;
      }

      h2 svg {
        color: #1f2937;
      }

      .documents-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .document-card {
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 0.2s;

        &:hover {
          border-color: #10b981;
          background: #f9fafb;
          transform: translateY(-2px);
        }

        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .doc-icon {
            color: #10b981;
          }

          .doc-status {
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;

            &.pending {
              background: #fef3c7;
              color: #92400e;
            }

            &.in-progress {
              background: #dbeafe;
              color: #1e40af;
            }

            &.completed {
              background: #d1fae5;
              color: #065f46;
            }
          }
        }

        .doc-info {
          flex: 1;

          h3 {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 8px;
          }

          p {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 12px;
          }

          .doc-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .meta-item {
              font-size: 11px;
              color: #6b7280;
              background: #f3f4f6;
              padding: 4px 8px;
              border-radius: 6px;
            }

            .meta-item svg {
              color: #6b7280;
            }
          }
        }

        .doc-actions {
          button {
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 24px;
      }

      h2 svg {
        color: #1f2937;
      }

      .progress-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 32px;

        .stat-item {
          background: #f9fafb;
          padding: 20px;
          border-radius: 10px;
          text-align: center;

          .stat-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 500;
          }

          .stat-value {
            font-size: 28px;
            color: #10b981;
            font-weight: 700;
          }
        }
      }

      .progress-bar-section {
        .progress-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;

          .progress-percentage {
            color: #10b981;
            font-weight: 700;
          }
        }

        .progress-bar {
          height: 24px;
          background: #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;

          .progress-fill {
            height: 100%;
            transition: width 0.3s;
            border-radius: 12px;

            &.low {
              background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            &.medium {
              background: linear-gradient(90deg, #f59e0b, #d97706);
            }

            &.high {
              background: linear-gradient(90deg, #10b981, #059669);
            }
          }
        }

        .progress-description {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }
      }
    }

    .next-steps-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 24px;
      }

      h2 svg {
        color: #1f2937;
      }

      .steps-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .step-item {
        display: flex;
        gap: 16px;
        padding: 20px;
        background: #f9fafb;
        border-radius: 10px;
        border: 2px solid #e5e7eb;
        transition: all 0.2s;

        &.completed {
          background: #ecfdf5;
          border-color: #10b981;
          opacity: 0.7;

          .step-content h3 {
            text-decoration: line-through;
          }
        }

        &:not(.completed):hover {
          background: #f3f4f6;
        }

        .step-icon {
          color: #6b7280;
          flex-shrink: 0;
        }

        &.completed .step-icon {
          color: #10b981;
        }

        .step-content {
          flex: 1;

          h3 {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 6px;
          }

          p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .step-deadline {
            font-size: 12px;
            color: #f59e0b;
            font-weight: 500;
          }

          .step-deadline svg {
            color: #f59e0b;
          }
        }
      }
    }

    .help-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 24px;
      }

      h2 svg {
        color: #1f2937;
      }

      .help-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .help-card {
        padding: 24px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        text-align: center;
        transition: all 0.2s;

        &:hover {
          border-color: #10b981;
          background: #f9fafb;
        }

        .help-icon {
          color: #10b981;
          margin-bottom: 16px;
        }

        h3 {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
          margin-bottom: 8px;
        }

        p {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }
      }
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #10b981;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }

      p {
        color: #6b7280;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .documents-grid,
      .help-cards {
        grid-template-columns: 1fr !important;
      }

      .enterprise-card {
        flex-direction: column;
        text-align: center;
      }

      .progress-stats {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class InternshipPreprofessionalComponent implements OnInit {
  private documentService = inject(DocumentService);

  loading = false;
  hasEnterprise = true;
  
  // Datos de ejemplo - deben venir del backend
  enterpriseName = 'Tech Solutions S.A.';
  enterpriseAddress = 'Av. Principal 123, Quito';
  tutorName = 'Ing. María González';
  tutorEmail = 'maria.gonzalez@techsolutions.com';
  
  completedDocs = 1;
  totalDocs = 6;
  completedHours = 85;
  requiredHours = 240;
  evaluationsCount = 2;

  nextSteps = [
    {
      title: 'Generar Carta de Presentación',
      description: 'Documento necesario para formalizar tu ingreso a la empresa',
      deadline: '15 de Diciembre, 2024',
      completed: false
    },
    {
      title: 'Subir Plan de Actividades',
      description: 'Detalla las actividades que realizarás durante tus prácticas',
      deadline: '20 de Diciembre, 2024',
      completed: false
    },
    {
      title: 'Completar Primer Informe Mensual',
      description: 'Reporte de las actividades del primer mes',
      deadline: '31 de Diciembre, 2024',
      completed: false
    }
  ];

  ngOnInit(): void {
    // Cargar datos del estudiante
  }

  get progressPercentage(): number {
    return Math.round((this.completedDocs / this.totalDocs) * 100);
  }

  getProgressMessage(): string {
    const percentage = this.progressPercentage;
    if (percentage < 30) {
      return '¡Comienza tu proceso! Genera los documentos pendientes.';
    } else if (percentage < 70) {
      return '¡Buen progreso! Continúa con los siguientes pasos.';
    } else {
      return '¡Excelente! Estás muy cerca de completar tus prácticas.';
    }
  }

  generateDocument(type: string): void {
    console.log('Generating document:', type);
    alert(`Generando documento: ${type}\nEsta funcionalidad se conectará con el backend.`);
  }

  uploadDocument(type: string): void {
    console.log('Upload document:', type);
    alert(`Subir documento: ${type}\nAbrirá un selector de archivos.`);
  }
}