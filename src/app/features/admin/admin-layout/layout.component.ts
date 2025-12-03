import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div style="padding: 20px;">
      <h2>Panel Administrador</h2>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AdminLayoutComponent {}