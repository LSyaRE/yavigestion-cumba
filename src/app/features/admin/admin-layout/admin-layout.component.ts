import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
<div class="admin-layout" [class.collapsed]="isCollapsed">

  <!-- SIDEBAR -->
  <aside class="sidebar">

    <!-- HEADER -->
    <div class="sidebar-header">
      <img
        src="https://ignug.yavirac.edu.ec/assets/images/web/logo_login.png"
        class="logo-img"
        alt="Yavirac Logo"
      />
      <span class="logo-text">Yavirac</span>

      <button class="btn-toggle" (click)="toggleSidebar()" aria-label="Toggle sidebar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- NAV -->
    <nav class="sidebar-nav">
      <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="12" y="2" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="2" y="12" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
          <rect x="12" y="12" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="nav-text">Dashboard</span>
      </a>

      <a routerLink="/admin/periods" routerLinkActive="active" class="nav-item">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="2" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
          <path d="M2 9h18M6 2v4M16 2v4" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="nav-text">Periodos</span>
      </a>

      <a routerLink="/admin/careers" routerLinkActive="active" class="nav-item">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L2 6L11 10L20 6L11 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 16L11 20L20 16" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 11L11 15L20 11" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <span class="nav-text">Carreras</span>
      </a>

      <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          <path d="M5 19v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="nav-text">Usuarios</span>
      </a>
    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <button class="btn-logout" (click)="logout()">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 16L3 16C2.44772 16 2 15.5523 2 15L2 5C2 4.44772 2.44772 4 3 4L7 4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M13 13L18 10L13 7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M6 10H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="nav-text">Cerrar sesión</span>
      </button>
    </div>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="main-content">
    <header class="top-bar">
      <h2>Panel de Administración</h2>

      <div class="user-info">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 6v4M10 13v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>Administrador</span>
      </div>
    </header>

    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </main>

</div>
`,
  styles: [`
/* ================= GENERAL ================= */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
  font-family: 'Segoe UI', sans-serif;
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  background: #0f172a;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  transition: width 0.3s ease;
}

/* ================= HEADER ================= */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-img {
  width: 40px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #f97316;
  white-space: nowrap;
}

.btn-toggle {
  margin-left: auto;
  background: none;
  border: none;
  color: #cbd5f5;
  cursor: pointer;
}

/* ================= NAV ================= */
.sidebar-nav {
  flex: 1;
  padding: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #cbd5f5;
  text-decoration: none;
  margin-bottom: 6px;
  transition: all 0.25s ease;
}

.nav-item svg {
  flex-shrink: 0;
}

.nav-item:hover {
  background: rgba(59,130,246,0.15);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

/* ================= FOOTER ================= */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(249,115,22,0.15);
  color: #f97316;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-logout:hover {
  background: rgba(249,115,22,0.3);
}

/* ================= MAIN ================= */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

/* ================= TOP BAR ================= */
.top-bar {
  background: white;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.top-bar h2 {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-weight: 500;
}

/* ================= CONTENT ================= */
.content-area {
  padding: 32px;
}

/* ================= COLLAPSED ================= */
.admin-layout.collapsed .sidebar {
  width: 80px;
}

.admin-layout.collapsed .main-content {
  margin-left: 80px;
}

.admin-layout.collapsed .logo-text,
.admin-layout.collapsed .nav-text {
  display: none;
}

.admin-layout.collapsed .nav-item,
.admin-layout.collapsed .btn-logout {
  justify-content: center;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .admin-layout.collapsed .sidebar {
    width: 70px;
  }
}
  `]
})
export class AdminLayoutComponent {

  private authService = inject(AuthService);

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}