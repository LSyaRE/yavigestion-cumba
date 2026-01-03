import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Career, GenericResponse, AcademicPeriod } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private careers: Career[] = [];
  private periods: AcademicPeriod[] = [];
  private nextCareerId = 1;
  private nextPeriodId = 1;

  private careers$ = new BehaviorSubject<Career[]>([]);
  private periods$ = new BehaviorSubject<AcademicPeriod[]>([]);

  constructor() {
    // Crear periodos iniciales
    const period1: AcademicPeriod = { 
      id: this.nextPeriodId++,
      totalCareers: 0 ,
      name: '2025 - Primer Semestre', 
      startDate: new Date('2025-02-01'), 
      endDate: new Date('2025-06-30'), 
      careers: [], 
      status: 'Activo' 
    };
    const period2: AcademicPeriod = { 
      id: this.nextPeriodId++, 
      name: '2025 - Segundo Semestre', 
      startDate: new Date('2025-08-01'), 
      endDate: new Date('2025-12-15'), 
      totalCareers: 10,
      careers: [], 
      status: 'Activo' 
    };
    this.periods.push(period1, period2);
    this.periods$.next(this.periods);

    // Crear carreras iniciales
    this.create({ name: 'Ingeniería Informática', description: 'Carrera dual', isDual: true, status: 'Activo', periodId: period1.id }).subscribe();
    this.create({ name: 'Administración', description: 'Carrera tradicional', isDual: false, status: 'Activo', periodId: period2.id }).subscribe();
  }

  getAll(): Observable<Career[]> {
    return this.careers$.asObservable().pipe(delay(100));
  }

  getById(id: number): Observable<Career> {
    const career = this.careers.find(c => c.id === id);
    return of(career!).pipe(delay(100));
  }

  getPeriods(): Observable<AcademicPeriod[]> {
    return this.periods$.asObservable().pipe(delay(100));
  }

  create(career: Partial<Career>): Observable<GenericResponse<Career>> {
    const newCareer: Career = {
      id: this.nextCareerId++,
      name: career.name || '',
      description: career.description || '',
      isDual: career.isDual || false,
      status: career.status || 'Activo',
      periodId: career.periodId || 0,
      academicPeriod: undefined
    };

    // Vincular periodo
    const period = this.periods.find(p => p.id === newCareer.periodId);
    if (period) {
      period.careers = period.careers || [];
      period.careers.push(newCareer);
    }

    this.careers.push(newCareer);
    this.careers$.next(this.careers);
    this.periods$.next(this.periods);

    return of({ data: newCareer, message: 'Carrera creada', status: 200 }).pipe(delay(100));
  }

  update(id: number, career: Career): Observable<GenericResponse<Career>> {
    const index = this.careers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Carrera no encontrada');

    const oldCareer = this.careers[index];

    // Remover de periodo anterior si cambió
    if (oldCareer.periodId !== career.periodId) {
      const oldPeriod = this.periods.find(p => p.id === oldCareer.periodId);
      if (oldPeriod?.careers) {
        oldPeriod.careers = oldPeriod.careers.filter(c => c.id !== id);
      }
    }

    // Asociar al nuevo periodo
    const newPeriod = this.periods.find(p => p.id === career.periodId);
    if (newPeriod) {
      newPeriod.careers = newPeriod.careers || [];
      if (!newPeriod.careers.find(c => c.id === id)) newPeriod.careers.push(career);
      this.periods$.next(this.periods);
    }

    this.careers[index] = { ...career, id };
    this.careers$.next(this.careers);

    return of({ data: this.careers[index], message: 'Carrera actualizada', status: 200 }).pipe(delay(100));
  }

  delete(id: number): Observable<void> {
    const career = this.careers.find(c => c.id === id);
    if (career) {
      const period = this.periods.find(p => p.id === career.periodId);
      if (period?.careers) {
        period.careers = period.careers.filter(c => c.id !== id);
      }
    }
    this.careers = this.careers.filter(c => c.id !== id);
    this.careers$.next(this.careers);
    this.periods$.next(this.periods);
    return of(void 0).pipe(delay(100));
  }

  getByCoordinator(): Observable<Career[]> {
    return this.getAll();
  }
}
