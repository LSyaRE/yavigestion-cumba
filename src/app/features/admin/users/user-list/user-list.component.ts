import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-list">
      <div class="list-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administración de usuarios del sistema</p>
        </div>
        <a routerLink="/admin/users/new" class="btn btn-primary">
          ➕ Nuevo Usuario
        </a>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-tabs">
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'all'"
            (click)="filterByRole('all')"
          >
            Todos ({{ users.length }})
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'admin'"
            (click)="filterByRole('admin')"
          >
            Administradores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'coordinator'"
            (click)="filterByRole('coordinator')"
          >
            Coordinadores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'tutor'"
            (click)="filterByRole('tutor')"
          >
            Tutores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'student'"
            (click)="filterByRole('student')"
          >
            Estudiantes
          </button>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div class="users-table-container" *ngIf="!loading && filteredUsers.length > 0">
        <table class="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ getInitials(user.person?.name, user.person?.lastname) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">
                      {{ user.person?.name }} {{ user.person?.lastname }}
                    </div>
                    <div class="user-dni">{{ user.person?.dni || 'Sin DNI' }}</div>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <div class="roles-badges">
                  <span 
                    *ngFor="let role of user.roles" 
                    class="role-badge"
                    [class.admin]="role.name.toLowerCase().includes('admin')"
                    [class.coordinator]="role.name.toLowerCase().includes('coordinator')"
                    [class.tutor]="role.name.toLowerCase().includes('tutor')"
                    [class.student]="role.name.toLowerCase().includes('student')"
                  >
                    {{ getRoleName(role.name) }}
                  </span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.status === 'Activo'">
                  {{ user.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <a [routerLink]="['/admin/users', user.id, 'edit']" class="btn btn-sm btn-outline">
                    ✏️ Editar
                  </a>
                  <a [routerLink]="['/admin/users', user.id, 'roles']" class="btn btn-sm btn-outline">
                    🔑 Roles
                  </a>
                  <button class="btn btn-sm btn-danger" (click)="deleteUser(user)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredUsers.length === 0">
        <div class="empty-icon">👥</div>
        <h3>No hay usuarios</h3>
        <p>{{ selectedRole === 'all' ? 'No hay usuarios registrados' : 'No hay usuarios con este rol' }}</p>
      </div>
    </div>
  `,
  styles: [`
   /* ================= CONTENEDOR GENERAL ================= */
.user-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #f3f4f6;
  min-height: 100vh;
}

/* ================= HEADER ================= */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.list-header h1 {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.list-header p {
  font-size: 15px;
  color: #6b7280;
}

/* ================= BOTONES ================= */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-outline {
  background: white;
  border: 1.5px solid #e5e7eb;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #4f46e5;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

/* ================= FILTROS ================= */
.filters-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 20px;
  border: 1.5px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #f9fafb;
  border-color: #4f46e5;
}

.tab-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

/* ================= LOADING ================= */
.loading-spinner {
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #e5e7eb;
  border-top-color: #4f46e5;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= TABLA ================= */
.users-table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background: #f9fafb;
}

.users-table th {
  text-align: left;
  padding: 16px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

.users-table tr:hover {
  background: #f9fafb;
}

/* ================= USUARIO ================= */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 42px;
  height: 42px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #111827;
}

.user-dni {
  font-size: 12px;
  color: #6b7280;
}

/* ================= ROLES ================= */
.roles-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.role-badge.admin {
  background: #fee2e2;
  color: #991b1b;
}

.role-badge.coordinator {
  background: #dbeafe;
  color: #1e40af;
}

.role-badge.tutor {
  background: #fef3c7;
  color: #92400e;
}

.role-badge.student {
  background: #d1fae5;
  color: #065f46;
}

/* ================= ESTADO ================= */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

/* ================= ACCIONES ================= */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ================= EMPTY ================= */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
  }
}
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  selectedRole = 'all';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    if (role === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.roles?.some(r => r.name.toLowerCase().includes(role))
      );
    }
  }

  deleteUser(user: User): void {
    if (confirm(`¿Eliminar a ${user.person?.name || user.email}?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterByRole(this.selectedRole);
        }
      });
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getRoleName(role: string): string {
    const names: { [key: string]: string } = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_COORDINATOR': 'Coordinador',
      'ROLE_TUTOR': 'Tutor',
      'ROLE_STUDENT': 'Estudiante'
    };
    return names[role] || role;
  }
}