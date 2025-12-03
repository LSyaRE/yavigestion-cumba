import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'periods',
        children: [
          {
            path: '',
            loadComponent: () => import('./periods/period-list/period-list.component')
              .then(m => m.PeriodListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./periods/period-form/period-form.component')
              .then(m => m.PeriodFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./periods/period-form/period-form.component')
              .then(m => m.PeriodFormComponent)
          },
          {
            path: ':id/careers',
            loadComponent: () => import('./periods/period-careers/period-careers.component')
              .then(m => m.PeriodCareersComponent)
          }
        ]
      },
      {
        path: 'careers',
        children: [
          {
            path: '',
            loadComponent: () => import('./careers/career-list/career-list.component')
              .then(m => m.CareerListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./careers/career-form/career-form.component')
              .then(m => m.CareerFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./careers/career-form/career-form.component')
              .then(m => m.CareerFormComponent)
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./users/user-list/user-list.component')
              .then(m => m.UserListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./users/user-form/user-form.component')
              .then(m => m.UserFormComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./users/user-form/user-form.component')
              .then(m => m.UserFormComponent)
          },
          {
            path: ':id/roles',
            loadComponent: () => import('./users/assign-roles/assign-roles.component')
              .then(m => m.AssignRolesComponent)
          }
        ]
      }
    ]
  }
];