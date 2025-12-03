import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Página No Encontrada</h1>
        <p>La página que buscas no existe o ha sido movida.</p>
        <button class="btn btn-primary" routerLink="/dashboard">
          Ir al Inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f9fafb;
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
      padding: 40px;
    }

    .error-code {
      font-size: 120px;
      font-weight: 700;
      color: #667eea;
      line-height: 1;
      margin-bottom: 16px;
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
export class NotFoundComponent {}