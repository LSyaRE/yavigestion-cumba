import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-container">
      <div class="header">
        <h1>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display: inline; vertical-align: middle;">
            <path d="M10 4h8l6 6v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2"/>
            <path d="M18 4v6h6" stroke="currentColor" stroke-width="2"/>
            <path d="M12 16h8M12 20h8" stroke="currentColor" stroke-width="2"/>
          </svg>
          Mis Documentos
        </h1>
        <p>Documentos generados y descargables</p>
      </div>

      <div class="documents-categories">
        <div class="category-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
              <path d="M10 6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h1v-2h-1v-1h1v-1h-1v-1h1v-1h-1z" fill="currentColor"/>
              <path d="M14 6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h1v-2h-1v-1h1v-1h-1v-1h1v-1h-1z" fill="currentColor"/>
            </svg>
            Vinculación
          </h2>
          <div class="docs-list">
            <div class="doc-item">
              <div class="doc-info">
                <span class="doc-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </span>
                <span class="doc-name">Ficha de Registro - Vinculación.pdf</span>
              </div>
              <button class="btn btn-sm btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M8 10l-3-3M8 10l3-3M3 13h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Descargar
              </button>
            </div>
          </div>
        </div>

        <div class="category-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="display: inline; vertical-align: middle; margin-right: 8px;">
              <path d="M10 2L4 6v6l6 4 6-4V6l-6-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M10 10V14" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            Prácticas Duales
          </h2>
          <div class="docs-list">
            <div class="doc-item">
              <div class="doc-info">
                <span class="doc-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                    <path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </span>
                <span class="doc-name">Plan de Trabajo.pdf</span>
              </div>
              <button class="btn btn-sm btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M8 10l-3-3M8 10l3-3M3 13h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Descargar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
        color: #1f2937;
        font-weight: 700;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .category-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 18px;
        color: #1f2937;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .docs-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .doc-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background: #f9fafb;
          border-color: #10b981;
        }

        .doc-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .doc-icon {
            color: #2563eb;
            display: flex;
            align-items: center;
          }

          .doc-name {
            font-size: 14px;
            color: #1f2937;
            font-weight: 500;
          }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      }
    }
  `]
})
export class DocumentsComponent {}