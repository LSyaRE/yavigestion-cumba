import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastNotificationsComponent } from './shared/components/toast-notifications/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastNotificationsComponent
  ],
  template: `
    <router-outlet></router-outlet>
    <app-toast-notifications></app-toast-notifications>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'yavirac-frontend';
}