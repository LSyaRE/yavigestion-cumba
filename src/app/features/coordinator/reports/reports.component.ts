import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <h2>Generar Reportes</h2>

      <div class="report-types">
        <div class="report-card" *ngFor="let report of reportTypes">
          <div class="report-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <ng-container *ngIf="report.type === 'students'">
                <circle cx="22" cy="20" r="8" stroke="currentColor" stroke-width="3"/>
                <circle cx="42" cy="20" r="8" stroke="currentColor" stroke-width="3"/>
                <path d="M8 52v-4a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v4M36 52v-4a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v4" stroke="currentColor" stroke-width="3"/>
              </ng-container>
              <ng-container *ngIf="report.type === 'vinculation'">
                <path d="M24 20c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h4v-8h-4v-4h4v-4h-4v-4h4v-4h-4z" fill="currentColor"/>
                <path d="M40 20c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h4v-8h-4v-4h4v-4h-4v-4h4v-4h-4z" fill="currentColor"/>
              </ng-container>
              <ng-container *ngIf="report.type === 'internships'">
                <rect x="12" y="20" width="40" height="28" rx="4" stroke="currentColor" stroke-width="3"/>
                <path d="M20 16h24v4H20z" fill="currentColor"/>
              </ng-container>
            </svg>
          </div>
          <h3>{{ report.title }}</h3>
          <p>{{ report.description }}</p>
          <button class="btn btn-primary" (click)="generateReport(report.type)">
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.reports-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #f3f4f6;
  min-height: 100vh;
}

.reports-container h2 {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 32px;
  font-weight: 700;
}

/* ================= GRID ================= */
.report-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* ================= CARD ================= */
.report-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* ================= CONTENIDO ================= */
.report-icon {
  color: #667eea;
  margin-bottom: 16px;
}

.report-card h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 12px;
}

.report-card p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}

/* ================= BOTÓN ================= */
.btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-primary {
  background: #667eea;
  color: #ffffff;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .reports-container {
    padding: 16px;
  }

  .report-types {
    grid-template-columns: 1fr;
  }
}
`]

})
export class ReportsComponent {
  reportTypes = [
    {
      type: 'students',
      icon: '', // Ya no se usa, los iconos son SVG
      title: 'Reporte de Estudiantes',
      description: 'Lista completa de estudiantes con sus datos'
    },
    {
      type: 'vinculation',
      icon: '', // Ya no se usa, los iconos son SVG
      title: 'Vinculación',
      description: 'Reporte de estudiantes en vinculación'
    },
    {
      type: 'internships',
      icon: '', // Ya no se usa, los iconos son SVG
      title: 'Prácticas',
      description: 'Reporte de estudiantes en prácticas'
    }
  ];

  generateReport(type: string): void {
    console.log('Generating report:', type);
    alert(`Generando reporte de ${type}...`);
  }
}