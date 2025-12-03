import { Routes } from '@angular/router';

export const COORDINATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./coordinator-layout/coordinator-layout.component')
      .then(m => m.CoordinatorLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.CoordinatorDashboardComponent)
      },
      {
        path: 'students',
        children: [
          {
            path: '',
            loadComponent: () => import('./students/student-list/student-list.component')
              .then(m => m.StudentListComponent)
          },
          {
            path: ':id/assign-tutor',
            loadComponent: () => import('./students/assign-tutor/assign-tutor.component')
              .then(m => m.AssignTutorComponent)
          }
        ]
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports.component')
          .then(m => m.ReportsComponent)
      }
    ]
  }
];