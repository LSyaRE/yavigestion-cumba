import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <button class="menu-toggle" (click)="onMenuToggle()" *ngIf="showMenuToggle">
          <span class="icon">☰</span>
        </button>
        
        <div class="navbar-title" *ngIf="title">
          <h1>{{ title }}</h1>
        </div>

        <div class="breadcrumb" *ngIf="breadcrumbs && breadcrumbs.length > 0">
          <span *ngFor="let crumb of breadcrumbs; let last = last">
            <span class="breadcrumb-item" [class.active]="last">{{ crumb }}</span>
            <span class="separator" *ngIf="!last">›</span>
          </span>
        </div>
      </div>

      <div class="navbar-right">
        <!-- Barra de búsqueda (opcional) -->
        <div class="search-box" *ngIf="showSearch">
          <input 
            type="text" 
            placeholder="Buscar..."
            class="search-input"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
          <span class="search-icon">🔍</span>
        </div>

        <!-- Notificaciones -->
        <div class="notification-btn" (click)="toggleNotifications()" *ngIf="showNotifications">
          <span class="icon">🔔</span>
          <span class="badge" *ngIf="notificationCount > 0">{{ notificationCount }}</span>
        </div>

        <!-- Dropdown de notificaciones -->
        <div class="dropdown notifications-dropdown" *ngIf="notificationsOpen">
          <div class="dropdown-header">
            <h3>Notificaciones</h3>
            <span class="close-btn" (click)="toggleNotifications()">✕</span>
          </div>
          <div class="dropdown-body">
            <div class="notification-item" *ngFor="let notif of notifications">
              <div class="notif-icon">{{ notif.icon }}</div>
              <div class="notif-content">
                <div class="notif-title">{{ notif.title }}</div>
                <div class="notif-time">{{ notif.time }}</div>
              </div>
            </div>
            <div class="empty-notif" *ngIf="notifications.length === 0">
              No tienes notificaciones
            </div>
          </div>
        </div>

        <!-- Menú de usuario -->
        <div class="user-menu" (click)="toggleUserMenu()">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-info" *ngIf="showUserInfo">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
          <span class="dropdown-arrow">▼</span>
        </div>

        <!-- Dropdown de usuario -->
        <div class="dropdown user-dropdown" *ngIf="userMenuOpen">
          <div class="dropdown-item" (click)="goToProfile()">
            <span class="item-icon">👤</span>
            <span>Mi Perfil</span>
          </div>
          <div class="dropdown-item" (click)="goToSettings()">
            <span class="item-icon">⚙️</span>
            <span>Configuración</span>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item logout" (click)="logout()">
            <span class="item-icon">🚪</span>
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>

      <!-- Overlay para cerrar dropdowns -->
      <div class="overlay" *ngIf="userMenuOpen || notificationsOpen" (click)="closeDropdowns()"></div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;

      .menu-toggle {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;

        &:hover {
          background: #f3f4f6;
        }

        .icon {
          font-size: 20px;
        }
      }

      .navbar-title {
        h1 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;

        .breadcrumb-item {
          color: #6b7280;

          &.active {
            color: #1f2937;
            font-weight: 500;
          }
        }

        .separator {
          color: #9ca3af;
        }
      }
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;

      .search-box {
        position: relative;

        .search-input {
          width: 300px;
          padding: 8px 36px 8px 12px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }

        .search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          pointer-events: none;
        }
      }

      .notification-btn {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #f3f4f6;
        }

        .icon {
          font-size: 20px;
        }

        .badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 12px 6px 6px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #f9fafb;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-info {
          .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }

          .user-role {
            font-size: 12px;
            color: #6b7280;
          }
        }

        .dropdown-arrow {
          font-size: 10px;
          color: #6b7280;
        }
      }
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      min-width: 280px;
      z-index: 1000;
      animation: fadeIn 0.2s ease;

      &.user-dropdown {
        right: 0;
      }

      &.notifications-dropdown {
        right: 60px;
        max-height: 400px;
        overflow-y: auto;
      }

      .dropdown-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          cursor: pointer;
          color: #6b7280;
          font-size: 18px;

          &:hover {
            color: #1f2937;
          }
        }
      }

      .dropdown-body {
        max-height: 300px;
        overflow-y: auto;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        cursor: pointer;
        transition: background 0.2s;
        color: #374151;
        font-size: 14px;

        &:hover {
          background: #f9fafb;
        }

        &.logout {
          color: #ef4444;
        }

        .item-icon {
          font-size: 18px;
        }
      }

      .dropdown-divider {
        height: 1px;
        background: #e5e7eb;
        margin: 8px 0;
      }

      .notification-item {
        display: flex;
        gap: 12px;
        padding: 12px 20px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #f9fafb;
        }

        .notif-icon {
          font-size: 24px;
        }

        .notif-content {
          flex: 1;

          .notif-title {
            font-size: 14px;
            color: #1f2937;
            margin-bottom: 4px;
          }

          .notif-time {
            font-size: 12px;
            color: #6b7280;
          }
        }
      }

      .empty-notif {
        padding: 40px 20px;
        text-align: center;
        color: #6b7280;
        font-size: 14px;
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: transparent;
      z-index: 99;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .navbar-right {
        .user-info {
          display: none;
        }

        .search-box .search-input {
          width: 200px;
        }
      }
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() title?: string;
  @Input() breadcrumbs?: string[];
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Rol';
  @Input() userInitials: string = 'U';
  @Input() showMenuToggle: boolean = true;
  @Input() showSearch: boolean = false;
  @Input() showNotifications: boolean = true;
  @Input() showUserInfo: boolean = true;
  @Input() notificationCount: number = 0;
  @Input() notifications: any[] = [];

  @Output() menuToggle = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  userMenuOpen = false;
  notificationsOpen = false;
  searchQuery = '';

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    if (this.notificationsOpen) {
      this.userMenuOpen = false;
    }
  }

  closeDropdowns(): void {
    this.userMenuOpen = false;
    this.notificationsOpen = false;
  }

  goToProfile(): void {
    this.closeDropdowns();
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.closeDropdowns();
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.closeDropdowns();
    this.authService.logout();
  }
}