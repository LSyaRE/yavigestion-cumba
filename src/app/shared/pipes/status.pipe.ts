import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    const statusMap: { [key: string]: string } = {
      'Activo': 'Activo',
      'Inactivo': 'Inactivo',
      'Matriculado': 'Matriculado',
      'Graduado': 'Graduado',
      'Aprobado': 'Aprobado',
      'Pendiente': 'Pendiente',
      'Rechazado': 'Rechazado'
    };

    return statusMap[value] || value;
  }
}