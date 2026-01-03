import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericResponse } from '@core/models';
import { DashboardStats } from '@core/models/dashboard-stats.model';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = `${environment.apiUrl}/stats`;
  constructor(private httpClient: HttpClient) { }

  findDashboardStats(): Observable<DashboardStats> {
    return this.httpClient.get<GenericResponse<DashboardStats>>(this.apiUrl + "/dashboard").pipe(
      map((res)=>{
        return res.data ?? {totalAcademicPeriods: 0, totalCareers: 0, totalUsers: 0, totalActivePeriods: 0}
      })
    );
  }

}
