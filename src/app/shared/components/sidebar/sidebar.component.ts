// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">{{ logoIcon }}</span>
          <span class="logo-text" *ngIf="!collapsed">{{ title }}</span>
        </div>
        <button class="toggle-btn" (click)="toggleSidebar()">
          <span>{{ collapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of menuItems" class="nav-item">
            <a 
              [routerLink]="item.route" 
              routerLinkActive="active"
              class="nav-link"
              [title]="collapsed ? item.label : ''"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
            </a>

            <!-- Submenu (si existe) -->
            <ul class="submenu" *ngIf="item.children && !collapsed">
              <li *ngFor="let child of item.children" class="submenu-item">
                <a 
                  [routerLink]="child.route" 
                  routerLinkActive="active"
                  class="submenu-link"
                >
                  <span class="submenu-icon">{{ child.icon }}</span>
                  <span class="submenu-label">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer" *ngIf="!collapsed">
        <div class="user-info">
          <div class="user-avatar">{{ userInitials }}</div>
          <div class="user-details">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: sticky;
      top: 0;

      &.collapsed {
        width: 70px;

        .logo-text,
        .nav-label,
        .submenu {
          display: none;
        }

        .sidebar-footer {
          display: none;
        }

        .nav-link {
          justify-content: center;
        }
      }
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;

        .logo-icon {
          font-size: 28px;
          line-height: 1;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }
      }

      .toggle-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: #f3f4f6;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover {
          background: #e5e7eb;
        }

        span {
          font-size: 16px;
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 16px 0;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin: 0;

      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        color: #6b7280;
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
          background: #f9fafb;
          color: #667eea;
        }

        &.active {
          background: #eef2ff;
          color: #667eea;
          border-right: 3px solid #667eea;
          font-weight: 500;
        }

        .nav-icon {
          font-size: 20px;
          min-width: 20px;
          text-align: center;
        }

        .nav-label {
          font-size: 14px;
        }
      }
    }

    .submenu {
      list-style: none;
      padding: 0;
      margin: 4px 0 8px 0;
      background: #f9fafb;

      .submenu-item {
        .submenu-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px 10px 52px;
          color: #6b7280;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;

          &:hover {
            background: #f3f4f6;
            color: #667eea;
          }

          &.active {
            color: #667eea;
            font-weight: 500;
          }

          .submenu-icon {
            font-size: 16px;
          }
        }
      }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid #e5e7eb;

      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-details {
          flex: 1;
          min-width: 0;

          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

        &.collapsed {
          transform: translateX(-100%);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() title: string = 'Sistema Yavirac';
  @Input() logoIcon: string = '🎓';
  @Input() menuItems: MenuItem[] = [];
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Rol';
  @Input() userInitials: string = 'U';

  collapsed = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}