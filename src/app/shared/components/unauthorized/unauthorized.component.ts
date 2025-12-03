import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#ef4444" stroke-width="4"/>
            <path d="M35 50 L65 50" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </div>
        <h1>403 - Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <button class="btn btn-primary" routerLink="/dashboard">
          Volver al Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f9fafb;
    }

    .unauthorized-content {
      text-align: center;
      max-width: 500px;
      padding: 40px;
    }

    .icon {
      margin-bottom: 24px;
    }

    h1 {
      font-size: 28px;
      color: #1f2937;
      margin-bottom: 12px;
    }

    p {
      color: #6b7280;
      font-size: 16px;
      margin-bottom: 24px;
    }
  `]
})
export class UnauthorizedComponent {}
