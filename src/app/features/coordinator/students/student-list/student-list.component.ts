import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InternshipService } from '../../../../core/services/internship.service';
import { Internship, InternshipStatus } from '../../../../core/models';

@Component({
  selector: 'app-internship-preprofessional',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="internship-detail">
      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          ← Volver
        </button>
        <div class="header-content">
          <h1>Práctica Preprofesional</h1>
          <p>Detalles y gestión de la práctica</p>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información de la práctica...</p>
      </div>

      <!-- Error Message -->
      <div class="alert alert-error" *ngIf="errorMessage && !loading">
        <span class="alert-icon">⚠️</span>
        <div class="alert-content">
          <strong>Error</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-layout" *ngIf="!loading && internship">
        <!-- Left Column: Internship Information -->
        <div class="main-content">
          <!-- Status Card -->
          <div class="card status-card" [class]="'status-' + internship.status?.toLowerCase()">
            <div class="status-indicator">
              <span class="status-icon">{{ getStatusIcon(internship.status) }}</span>
              <div>
                <div class="status-label">Estado</div>
                <div class="status-value">{{ getStatusLabel(internship.status) }}</div>
              </div>
            </div>
          </div>

          <!-- Student Information -->
          <div class="card">
            <div class="card-header">
              <h2>Información del Estudiante</h2>
            </div>
            <div class="card-body">
              <div class="student-profile">
                <div class="student-avatar">
                  {{ getInitials(internship.student?.person?.name, internship.student?.person?.lastname) }}
                </div>
                <div class="student-info">
                  <h3>{{ internship.student?.person?.name }} {{ internship.student?.person?.lastname }}</h3>
                  <div class="info-row">
                    <span class="label">DNI:</span>
                    <span class="value">{{ internship.student?.person?.dni }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ internship.student?.email }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">Carrera:</span>
                    <span class="value">{{ internship.student?.career?.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Company Information -->
          <div class="card">
            <div class="card-header">
              <h2>Empresa/Institución</h2>
            </div>
            <div class="card-body">
              <div class="company-info">
                <div class="company-logo">🏢</div>
                <div>
                  <h3>{{ internship.company?.name || 'No asignada' }}</h3>
                  <div class="info-row" *ngIf="internship.company?.ruc">
                    <span class="label">RUC:</span>
                    <span class="value">{{ internship.company.ruc }}</span>
                  </div>
                  <div class="info-row" *ngIf="internship.company?.address">
                    <span class="label">Dirección:</span>
                    <span class="value">{{ internship.company.address }}</span>
                  </div>
                  <div class="info-row" *ngIf="internship.company?.phone">
                    <span class="label">Teléfono:</span>
                    <span class="value">{{ internship.company.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Internship Details -->
          <div class="card">
            <div class="card-header">
              <h2>Detalles de la Práctica</h2>
            </div>
            <div class="card-body">
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Período</span>
                  <span class="detail-value">{{ internship.period?.name || 'No especificado' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tipo</span>
                  <span class="detail-value badge badge-prepro">Prácticas Preprofesionales</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fecha de Inicio</span>
                  <span class="detail-value">{{ formatDate(internship.startDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Fecha de Fin</span>
                  <span class="detail-value">{{ formatDate(internship.endDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Horas Totales</span>
                  <span class="detail-value">{{ internship.totalHours || 0 }} horas</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Horas Completadas</span>
                  <span class="detail-value">{{ internship.completedHours || 0 }} horas</span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-section" *ngIf="internship.totalHours">
                <div class="progress-header">
                  <span>Progreso</span>
                  <span class="progress-percentage">{{ getProgressPercentage() }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
                </div>
              </div>

              <!-- Activities Description -->
              <div class="activities-section" *ngIf="internship.activitiesDescription">
                <h4>Actividades Realizadas</h4>
                <p>{{ internship.activitiesDescription }}</p>
              </div>
            </div>
          </div>

          <!-- Tutor Information -->
          <div class="card" *ngIf="internship.tutor">
            <div class="card-header">
              <h2>Tutor Académico</h2>
            </div>
            <div class="card-body">
              <div class="tutor-info">
                <div class="tutor-avatar">
                  {{ getInitials(internship.tutor.person?.name, internship.tutor.person?.lastname) }}
                </div>
                <div>
                  <h3>{{ internship.tutor.person?.name }} {{ internship.tutor.person?.lastname }}</h3>
                  <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ internship.tutor.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Actions -->
        <div class="sidebar">
          <!-- Actions Card -->
          <div class="card actions-card">
            <div class="card-header">
              <h2>Acciones</h2>
            </div>
            <div class="card-body">
              <div class="action-buttons">
                <button 
                  class="btn btn-primary btn-block"
                  (click)="generateDocument()"
                  [disabled]="generatingDocument"
                >
                  <span class="btn-icon">📄</span>
                  {{ generatingDocument ? 'Generando...' : 'Generar Documentos' }}
                </button>

                <button 
                  class="btn btn-outline btn-block"
                  (click)="editInternship()"
                  *ngIf="canEdit()"
                >
                  <span class="btn-icon">✏️</span>
                  Editar Práctica
                </button>

                <button 
                  class="btn btn-success btn-block"
                  (click)="approveInternship()"
                  *ngIf="canApprove()"
                  [disabled]="approving"
                >
                  <span class="btn-icon">✓</span>
                  {{ approving ? 'Aprobando...' : 'Aprobar' }}
                </button>

                <button 
                  class="btn btn-danger btn-block"
                  (click)="rejectInternship()"
                  *ngIf="canReject()"
                  [disabled]="rejecting"
                >
                  <span class="btn-icon">✗</span>
                  {{ rejecting ? 'Rechazando...' : 'Rechazar' }}
                </button>
              </div>

              <!-- Info Box -->
              <div class="info-box">
                <div class="info-box-icon">ℹ️</div>
                <div class="info-box-content">
                  <strong>Documentos Generados</strong>
                  <p>Al generar documentos se crearán:</p>
                  <ul>
                    <li>Carta de presentación</li>
                    <li>Convenio de prácticas</li>
                    <li>Informe de seguimiento</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Card -->
          <div class="card">
            <div class="card-header">
              <h2>Línea de Tiempo</h2>
            </div>
            <div class="card-body">
              <div class="timeline">
                <div class="timeline-item" [class.active]="internship.status === 'PENDING'">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Pendiente</div>
                    <div class="timeline-date">Esperando revisión</div>
                  </div>
                </div>
                <div class="timeline-item" [class.active]="internship.status === 'IN_PROGRESS'">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">En Progreso</div>
                    <div class="timeline-date">Práctica activa</div>
                  </div>
                </div>
                <div class="timeline-item" [class.active]="internship.status === 'COMPLETED'">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-title">Completada</div>
                    <div class="timeline-date">Práctica finalizada</div>
                  </div>
                </div>
              </div>
            </div>
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
    .internship-detail {
      max-width: 1400px;
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

    .content-layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 24px;
      align-items: start;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
      overflow: hidden;

      &.status-card {
        padding: 20px 24px;
        border-left: 4px solid #6b7280;

        &.status-pending {
          border-left-color: #f59e0b;
          background: linear-gradient(to right, #fef3c7 0%, white 100%);
        }

        &.status-in_progress {
          border-left-color: #3b82f6;
          background: linear-gradient(to right, #dbeafe 0%, white 100%);
        }

        &.status-completed {
          border-left-color: #10b981;
          background: linear-gradient(to right, #d1fae5 0%, white 100%);
        }

        &.status-rejected {
          border-left-color: #ef4444;
          background: linear-gradient(to right, #fee2e2 0%, white 100%);
        }
      }
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 16px;

      .status-icon {
        font-size: 32px;
      }

      .status-label {
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }

      .status-value {
        font-size: 20px;
        font-weight: 700;
        color: #1f2937;
      }
    }

    .card-header {
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;

      h2 {
        font-size: 16px;
        color: #1f2937;
        font-weight: 600;
        margin: 0;
      }
    }

    .card-body {
      padding: 24px;
    }

    .student-profile, .company-info, .tutor-info {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .student-avatar, .tutor-avatar {
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

    .company-logo {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      flex-shrink: 0;
    }

    .student-info, .company-info > div, .tutor-info > div {
      flex: 1;

      h3 {
        font-size: 18px;
        color: #1f2937;
        font-weight: 700;
        margin: 0 0 12px 0;
      }
    }

    .info-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 14px;

      .label {
        color: #6b7280;
        font-weight: 500;
        min-width: 70px;
      }

      .value {
        color: #1f2937;
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .detail-item {
      .detail-label {
        display: block;
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
        font-weight: 600;
      }

      .detail-value {
        display: block;
        font-size: 16px;
        color: #1f2937;
        font-weight: 500;

        &.badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        &.badge-prepro {
          background: #d1fae5;
          color: #065f46;
        }
      }
    }

    .progress-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;

      .progress-percentage {
        color: #667eea;
      }
    }

    .progress-bar {
      height: 12px;
      background: #e5e7eb;
      border-radius: 6px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        transition: width 0.3s ease;
      }
    }

    .activities-section {
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

      p {
        color: #4b5563;
        line-height: 1.6;
        margin: 0;
      }
    }

    .actions-card {
      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .btn-block {
        width: 100%;
        justify-content: center;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .btn-icon {
        font-size: 16px;
      }
    }

    .info-box {
      padding: 16px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      display: flex;
      gap: 12px;

      .info-box-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .info-box-content {
        flex: 1;

        strong {
          display: block;
          color: #1e40af;
          margin-bottom: 8px;
          font-size: 14px;
        }

        p {
          color: #1e3a8a;
          font-size: 13px;
          margin: 0 0 8px 0;
        }

        ul {
          margin: 0;
          padding-left: 20px;
          color: #1e3a8a;
          font-size: 13px;

          li {
            margin-bottom: 4px;
          }
        }
      }
    }

    .timeline {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e5e7eb;
      }
    }

    .timeline-item {
      position: relative;
      padding-left: 36px;
      padding-bottom: 24px;

      &:last-child {
        padding-bottom: 0;
      }

      .timeline-marker {
        position: absolute;
        left: 5px;
        top: 4px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #e5e7eb;
        border: 2px solid white;
        box-shadow: 0 0 0 2px #e5e7eb;
      }

      &.active .timeline-marker {
        background: #667eea;
        box-shadow: 0 0 0 2px #667eea;
      }

      .timeline-title {
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .timeline-date {
        color: #6b7280;
        font-size: 12px;
      }

      &.active .timeline-title {
        color: #667eea;
      }
    }

    @media (max-width: 1024px) {
      .content-layout {
        grid-template-columns: 1fr;
      }

      .sidebar {
        order: -1;
      }
    }

    @media (max-width: 640px) {
      .details-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .student-profile, .company-info, .tutor-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }
  `]
})
export class InternshipPreprofessionalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private internshipService = inject(InternshipService);

  internship: Internship | null = null;
  loading = true;
  generatingDocument = false;
  approving = false;
  rejecting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    const internshipId = this.route.snapshot.paramMap.get('id');
    if (internshipId) {
      this.loadInternship(+internshipId);
    } else {
      this.errorMessage = 'ID de práctica no válido';
      this.loading = false;
    }
  }

  private loadInternship(internshipId: number): void {
    this.internshipService.getById(internshipId).subscribe({
      next: (internship) => {
        this.internship = internship;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la información de la práctica';
        this.loading = false;
        console.error('Error loading internship:', error);
      }
    });
  }

  generateDocument(): void {
    if (!this.internship?.id) return;

    this.generatingDocument = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.internshipService.generateDocuments(this.internship.id).subscribe({
      next: (blob: Blob) => {
        // Generar nombre del archivo con timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const studentName = this.internship?.student?.person?.lastname || 'estudiante';
        const filename = `Practica_Preprofesional_${studentName}_${timestamp}.pdf`;

        // Descargar el archivo
        this.downloadBlob(blob, filename);

        this.successMessage = 'Documentos generados y descargados exitosamente';
        this.generatingDocument = false;

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Error al generar los documentos. Por favor, intente nuevamente.';
        this.generatingDocument = false;
        console.error('Error generating documents:', error);
      }
    });
  }

  /**
   * Helper method para descargar un Blob como archivo
   * @param blob El Blob a descargar
   * @param filename El nombre del archivo
   */
  private downloadBlob(blob: Blob, filename: string): void {
    // Crear URL del blob
    const url = window.URL.createObjectURL(blob);

    // Crear elemento <a> temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Agregar al DOM, hacer click, y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar la URL del blob
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  editInternship(): void {
    if (this.internship?.id) {
      this.router.navigate(['/coordinator/internships', this.internship.id, 'edit']);
    }
  }

  approveInternship(): void {
    if (!this.internship?.id) return;

    if (!confirm('¿Está seguro de aprobar esta práctica preprofesional?')) {
      return;
    }

    this.approving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.internshipService.updateStatus(this.internship.id, 'IN_PROGRESS').subscribe({
      next: () => {
        this.successMessage = 'Práctica aprobada exitosamente';
        this.approving = false;
        
        // Recargar los datos
        this.loadInternship(this.internship!.id!);
      },
      error: (error) => {
        this.errorMessage = 'Error al aprobar la práctica';
        this.approving = false;
        console.error('Error approving internship:', error);
      }
    });
  }

  rejectInternship(): void {
    if (!this.internship?.id) return;

    const reason = prompt('¿Por qué rechaza esta práctica? (opcional)');
    
    if (reason === null) {
      return; // Usuario canceló
    }

    this.rejecting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.internshipService.updateStatus(this.internship.id, 'REJECTED').subscribe({
      next: () => {
        this.successMessage = 'Práctica rechazada';
        this.rejecting = false;
        
        // Recargar los datos
        this.loadInternship(this.internship!.id!);
      },
      error: (error) => {
        this.errorMessage = 'Error al rechazar la práctica';
        this.rejecting = false;
        console.error('Error rejecting internship:', error);
      }
    });
  }

  canEdit(): boolean {
    return this.internship?.status === 'PENDING' || this.internship?.status === 'IN_PROGRESS';
  }

  canApprove(): boolean {
    return this.internship?.status === 'PENDING';
  }

  canReject(): boolean {
    return this.internship?.status === 'PENDING' || this.internship?.status === 'IN_PROGRESS';
  }

  goBack(): void {
    this.router.navigate(['/coordinator/internships']);
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getStatusLabel(status?: InternshipStatus): string {
    const labels: { [key in InternshipStatus]: string } = {
      'PENDING': 'Pendiente',
      'IN_PROGRESS': 'En Progreso',
      'COMPLETED': 'Completada',
      'REJECTED': 'Rechazada'
    };
    return status ? labels[status] : 'Desconocido';
  }

  getStatusIcon(status?: InternshipStatus): string {
    const icons: { [key in InternshipStatus]: string } = {
      'PENDING': '⏳',
      'IN_PROGRESS': '🔄',
      'COMPLETED': '✅',
      'REJECTED': '❌'
    };
    return status ? icons[status] : '❓';
  }

  formatDate(date?: string | Date): string {
    if (!date) return 'No especificada';
    const d = new Date(date);
    return d.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getProgressPercentage(): number {
    if (!this.internship?.totalHours || this.internship.totalHours === 0) {
      return 0;
    }
    const percentage = (this.internship.completedHours || 0) / this.internship.totalHours * 100;
    return Math.min(Math.round(percentage), 100);
  }
}