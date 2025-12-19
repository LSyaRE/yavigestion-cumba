import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
<div class="admin-layout">

  <!-- SIDEBAR -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="https://ignug.yavirac.edu.ec/assets/images/web/logo_login.png" class="logo-img" />
      <span class="logo-text">Yavirac</span>
    </div>

    <nav class="sidebar-nav">
      <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
        <span class="material-icons">dashboard</span>
        <span>Dashboard</span>
      </a>

      <a routerLink="/admin/periods" routerLinkActive="active" class="nav-item">
        <span class="material-icons">event</span>
        <span>Periodos</span>
      </a>

      <a routerLink="/admin/careers" routerLinkActive="active" class="nav-item">
        <span class="material-icons">school</span>
        <span>Carreras</span>
      </a>

      <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
        <span class="material-icons">people</span>
        <span>Usuarios</span>
      </a>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" (click)="logout()">
        <span class="material-icons">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </div>
  </aside>

  <!-- CONTENIDO -->
  <main class="main-content">
    <header class="top-bar">
      <h2>Panel de Administración</h2>
      <div class="user-info">
        <span class="material-icons">admin_panel_settings</span>
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
    .admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
  font-family: 'Segoe UI', sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: #0f172a; /* negro azulado */
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
}

/* HEADER */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-img {
  width: 40px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #f97316; /* naranja */
}

/* NAV */
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

.nav-item .material-icons {
  font-size: 22px;
}

.nav-item:hover {
  background: rgba(59,130,246,0.15);
  color: #fff;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

/* FOOTER */
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

/* MAIN */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

/* TOP BAR */
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

/* CONTENT */
.content-area {
  padding: 32px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .logo-text,
  .nav-item span:not(.material-icons),
  .btn-logout span:not(.material-icons) {
    display: none;
  }

  .main-content {
    margin-left: 70px;
  }
}
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}