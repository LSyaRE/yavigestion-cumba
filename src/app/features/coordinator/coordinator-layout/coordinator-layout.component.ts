import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-coordinator-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="coordinator-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" fill="#3b82f6"/>
              <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="20" font-weight="bold">Y</text>
            </svg>
            <span>Yavirac</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/coordinator/dashboard" routerLinkActive="active" class="nav-item">
            <span class="icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/coordinator/students" routerLinkActive="active" class="nav-item">
            <span class="icon">👥</span>
            <span>Estudiantes</span>
          </a>
          <a routerLink="/coordinator/reports" routerLinkActive="active" class="nav-item">
            <span class="icon">📄</span>
            <span>Reportes</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="btn-logout" (click)="logout()">
            <span class="icon">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="top-bar">
          <h2>Panel de Coordinador</h2>
          <div class="user-info">
            <span>Coordinador de Carrera</span>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* ================= LAYOUT GENERAL ================= */
.coordinator-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
}

/* ================= SIDEBAR HEADER ================= */
.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
}

/* ================= NAVEGACIÓN ================= */
.sidebar-nav {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 6px;
  border-radius: 10px;
  color: #d1d5db;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-item.active {
  background: #3b82f6;
  color: #ffffff;
}

.nav-item .icon {
  font-size: 20px;
}

/* ================= FOOTER SIDEBAR ================= */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* ================= CONTENIDO PRINCIPAL ================= */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

/* ================= TOP BAR ================= */
.top-bar {
  background: #ffffff;
  padding: 20px 32px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* ================= INFO USUARIO ================= */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

/* ================= CONTENIDO ================= */
.content-area {
  flex: 1;
  padding: 32px;
}

/* ================= SCROLL BAR ================= */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .sidebar {
    width: 72px;
  }

  .logo span,
  .nav-item span:not(.icon),
  .btn-logout span:not(.icon) {
    display: none;
  }

  .main-content {
    margin-left: 72px;
  }

  .top-bar {
    padding: 16px 20px;
  }

  .content-area {
    padding: 20px;
  }
}
  `]
})
export class CoordinatorLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}