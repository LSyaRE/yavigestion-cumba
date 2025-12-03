import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./student-layout/student-layout.component')
      .then(m => m.StudentLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.StudentDashboardComponent)
      },
      {
        path: 'subjects',
        children: [
          {
            path: 'vinculation',
            loadComponent: () => import('./my-subjects/vinculation/vinculation.component')
              .then(m => m.VinculationComponent)
          },
          {
            path: 'dual-internship',
            loadComponent: () => 
              import('./my-subjects/internship-dual/internship-dual.component')
              .then(m => m.InternshipDualComponent)
          },
          {
            path: 'preprofessional-internship',
            loadComponent: () => 
              import('./my-subjects/internship-preprofessional/internship-preprofessional.component')
              .then(m => m.InternshipPreprofessionalComponent)
          }
        ]
      },
      {
        path: 'documents',
        loadComponent: () => import('./documents/documents.component')
          .then(m => m.DocumentsComponent)
      }
    ]
  }
];