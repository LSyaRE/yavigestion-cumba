import { Routes } from '@angular/router';

export const TUTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tutor-layout/tutor-layout.component')
      .then(m => m.TutorLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.TutorDashboardComponent)
      },
      {
        path: 'my-students',
        loadComponent: () => import('./my-students/my-students.component')
          .then(m => m.MyStudentsComponent)
      },
      {
        path: 'evaluate/:studentId',
        loadComponent: () => import('./my-students/evaluation-form/evaluation-form.component')
          .then(m => m.EvaluationFormComponent)
      },
      {
        path: 'evaluations',
        loadComponent: () => import('./evaluations/evaluations.component')
          .then(m => m.EvaluationsComponent)
      }
    ]
  }
];
