import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-internship-dual',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="internship-container">
      <div class="header">
        <div class="header-content">
          <div class="icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 8L16 20v24h12v-12h8v12h12V20L32 8z" stroke="currentColor" stroke-width="3"/>
              <circle cx="32" cy="16" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h1>Prácticas de Formación Dual</h1>
            <p>Prácticas obligatorias curriculares</p>
          </div>
        </div>
      </div>

      <!-- Información -->
      <div class="info-card dual">
        <h2>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M8 6h10M8 10h10M8 14h10M4 6h.01M4 10h.01M4 14h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Información de las Prácticas
        </h2>
        <p>Las prácticas de formación dual son obligatorias y forman parte integral de tu programa académico.</p>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="badge active">En Curso</span>
          </div>
          <div class="info-item">
            <span class="label">Tipo:</span>
            <span class="value">Obligatorias/Curriculares</span>
          </div>
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
            <div class="doc-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M12 10h20M12 16h20M12 22h20M6 10h.01M6 16h.01M6 22h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="doc-info">
              <h3>Ficha de Registro</h3>
              <p>Datos básicos del estudiante y empresa</p>
            </div>
            <button class="btn btn-primary btn-sm">Completar</button>
          </div>

          <div class="document-card">
            <div class="doc-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 8h20l4 4v16a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
                <path d="M14 16h12M14 22h8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="doc-info">
              <h3>Plan de Trabajo</h3>
              <p>Actividades programadas</p>
            </div>
            <button class="btn btn-primary btn-sm">Subir</button>
          </div>

          <div class="document-card">
            <div class="doc-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="8" y="8" width="24" height="24" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M12 20l3 3 6-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="doc-info">
              <h3>Informes de Progreso</h3>
              <p>Reportes mensuales</p>
            </div>
            <button class="btn btn-primary btn-sm">Generar</button>
          </div>

          <div class="document-card">
            <div class="doc-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="2"/>
                <path d="M14 20l4 4 8-8" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="doc-info">
              <h3>Informe Final</h3>
              <p>Documento de cierre</p>
            </div>
            <button class="btn btn-outline btn-sm" disabled>Pendiente</button>
          </div>
        </div>
      </div>

      <!-- Progreso -->
      <div class="progress-section">
        <h2>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
            <path d="M11 3v8l5 3M11 21c5.523 0 10-4.477 10-10S16.523 1 11 1 1 5.477 1 11s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Progreso General
        </h2>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%"></div>
        </div>
        <p class="progress-text">45% completado</p>
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
          color: #3b82f6;
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

      &.dual {
        background: #eff6ff;
        border: 2px solid #3b82f6;
      }

      h2 {
        font-size: 18px;
        color: #1e40af;
        font-weight: 600;
        margin-bottom: 12px;
      }

      h2 svg {
        color: #1e40af;
      }

      p {
        color: #1e40af;
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
            color: #1e40af;
            font-weight: 500;
          }

          .value {
            font-size: 14px;
            color: #1e3a8a;
            font-weight: 700;
          }

          .badge {
            padding: 6px 12px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
          }
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
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }

      .document-card {
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        transition: all 0.2s;

        &:hover {
          border-color: #3b82f6;
          background: #f9fafb;
        }

        .doc-icon {
          color: #3b82f6;
        }

        .doc-info {
          flex: 1;

          h3 {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 6px;
          }

          p {
            font-size: 13px;
            color: #6b7280;
            margin: 0;
          }
        }
      }
    }

    .progress-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
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

      .progress-bar {
        height: 24px;
        background: #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 12px;

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.3s;
        }
      }

      .progress-text {
        text-align: center;
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .documents-grid {
        grid-template-columns: 1fr !important;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class InternshipDualComponent {}