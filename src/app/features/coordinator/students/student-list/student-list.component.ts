import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../../core/services/student.service';
import { CareerService } from '../../../../core/services/career.service';
import { PeriodService } from '../../../../core/services/period.service';
import { Student, Career, AcademicPeriod } from '../../../../core/models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="student-list-container">
      <div class="header">
        <h1>👥 Gestión de Estudiantes</h1>
        <p>Administración de estudiantes de tus carreras</p>
      </div>

      <!-- Filtros + Carga masiva -->
      <div class="filters-card">
        <div class="bulk-upload">
          <button class="btn btn-primary" (click)="fileInput.click()">
            📥 Carga masiva de estudiantes
          </button>

          <input
  #fileInput
  type="file"
  accept=".xlsx,.xls"
  hidden
  (change)="onFileSelected($event)"
/>
        </div>

        <div class="filters-row">
          <select [(ngModel)]="selectedCareer" (change)="applyFilters()" class="filter-select">
            <option value="">Todas las Carreras</option>
            <option *ngFor="let career of careers" [value]="career.id">
              {{ career.name }}
            </option>
          </select>

          <select [(ngModel)]="selectedPeriod" (change)="applyFilters()" class="filter-select">
            <option value="">Todos los Periodos</option>
            <option *ngFor="let period of periods" [value]="period.id">
              {{ period.name }}
            </option>
          </select>

          <select [(ngModel)]="selectedSubjectType" (change)="applyFilters()" class="filter-select">
            <option value="">Todos los Tipos</option>
            <option value="VINCULATION">Vinculación</option>
            <option value="DUAL_INTERNSHIP">Prácticas Dual</option>
            <option value="PREPROFESSIONAL_INTERNSHIP">Preprofesionales</option>
          </select>

          <button class="btn btn-outline" (click)="clearFilters()">
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Lista -->
      <div class="students-grid" *ngIf="!loading && filteredStudents.length > 0">
        <div class="student-card" *ngFor="let student of filteredStudents">
          <div class="student-header">
            <div class="student-avatar">
              {{ getInitials(student.person?.name, student.person?.lastname) }}
            </div>
            <div class="student-info">
              <h3>{{ student.person?.name }} {{ student.person?.lastname }}</h3>
              <p class="student-email">{{ student.email }}</p>
            </div>
          </div>

          <div class="student-details">
            <div class="detail-row">
              <span class="label">Carrera:</span>
              <span class="value">{{ student.career?.name || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">SIGA:</span>
              <span class="badge" [class.active]="student.isMatriculatedInSIGA">
                {{ student.isMatriculatedInSIGA ? '✓ Matriculado' : '✗ No matriculado' }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Tutor:</span>
              <span class="badge" [class.active]="student.tutor">
                {{ student.tutor ? '✓ Asignado' : '⏳ Sin asignar' }}
              </span>
            </div>
          </div>

          <div class="student-actions">
            <a
              [routerLink]="['/coordinator/students', student.id, 'assign-tutor']"
              class="btn btn-primary btn-sm btn-block"
            >
              👔 Asignar Tutor
            </a>
          </div>
        </div>
      </div>

      <!-- Estados -->
      <div class="empty-state" *ngIf="!loading && filteredStudents.length === 0">
        <div class="empty-icon">👥</div>
        <h3>No se encontraron estudiantes</h3>
        <p>No hay estudiantes que coincidan con los filtros seleccionados</p>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando estudiantes...</p>
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.student-list-container {
  max-width: 1400px;
  margin: 0 auto;
}

.bulk-upload {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

/* ================= HEADER ================= */
.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.header p {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

/* ================= FILTROS ================= */
.filters-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 16px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  min-width: 200px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
}

/* ================= GRID ================= */
.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ================= CARD ESTUDIANTE ================= */
.student-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(59,130,246,0.15);
}

/* ================= HEADER CARD ================= */
.student-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.student-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.student-email {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* ================= DETALLES ================= */
.student-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-row .label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.detail-row .value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

/* ================= BADGES ================= */
.badge {
  padding: 4px 10px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

/* ================= ACCIONES ================= */
.student-actions {
  margin-top: 12px;
}

/* ================= EMPTY & LOADING ================= */
.empty-state,
.loading-spinner {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #1f2937;
  margin-bottom: 8px;
}

.empty-state p,
.loading-spinner p {
  color: #6b7280;
  margin: 0;
}

/* ================= SPINNER ================= */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .students-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}
`]

})
export class StudentListComponent implements OnInit {

  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);

  students: Student[] = [];
  filteredStudents: Student[] = [];
  careers: Career[] = [];
  periods: AcademicPeriod[] = [];

  selectedCareer = '';
  selectedPeriod = '';
  selectedSubjectType = '';
  loading = true;

  ngOnInit(): void {
  this.loading = false;

  // Datos mock SOLO FRONT
  this.careers = [
    { id: 1, name: 'Desarrollo de Software' },
  { id: 2, name: 'Redes' }
  ] as Career[];

  this.periods = [
    { id: 1, name: '2025-1' },
    { id: 2, name: '2025-2' }
  ] as AcademicPeriod[];

  this.students = [];
  this.filteredStudents = [];
}
  private loadData(): void {
    this.loading = true;

    this.careerService.getByCoordinator().subscribe(c => this.careers = c);
    this.periodService.getAll().subscribe(p => this.periods = p);

    this.studentService.getAll().subscribe({
      next: students => {
        this.students = students;
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      if (this.selectedCareer && student.career?.id !== +this.selectedCareer) {
        return false;
      }

      if (this.selectedSubjectType) {
        return student.enrolledSubjects?.some(s => s.type === this.selectedSubjectType);
      }

      return true;
    });
  }

  clearFilters(): void {
    this.selectedCareer = '';
    this.selectedPeriod = '';
    this.selectedSubjectType = '';
    this.applyFilters();
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
    this.processBulkStudents(jsonData);

    input.value = ''; // ✅ ahora sí
  };

  reader.readAsArrayBuffer(file);
}

  processBulkStudents(data: any[]): void {
  const newStudents: Student[] = data.map((row, index) => {
    if (!row.identificacion || !row.nombre_estudiante) return null;

    const parts = row.nombre_estudiante.trim().split(' ');
    const lastname = parts.slice(-2).join(' ');
    const name = parts.slice(0, -2).join(' ');

    return {
      id: Date.now() + index, // ID temporal
      email: `${row.identificacion}@estudiante.test`,
      isMatriculatedInSIGA: true,
      person: {
        name,
        lastname
      },
     career: this.careers.find(c => c.id === Number(row.codigo_carrera)) || null,
    } as Student;
  }).filter(Boolean) as Student[];

  if (newStudents.length === 0) {
    alert('⚠️ No se encontraron estudiantes válidos');
    return;
  }

  // 🔥 INSERTAR EN FRONT
  this.students = [...this.students, ...newStudents];
  this.applyFilters();

  alert(`✅ ${newStudents.length} estudiantes cargados en el frontend`);
}

  getInitials(name?: string, lastname?: string): string {
    return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase() || 'U';
  }
}