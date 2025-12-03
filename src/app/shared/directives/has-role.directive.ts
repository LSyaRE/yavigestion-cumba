import { 
  Directive, 
  Input, 
  TemplateRef, 
  ViewContainerRef,
  OnInit,
  inject 
} from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input() appHasRole!: string | string[];

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const roles = Array.isArray(this.appHasRole) 
      ? this.appHasRole 
      : [this.appHasRole];
    
    const hasRole = roles.some(role => this.authService.hasRole(role));

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}