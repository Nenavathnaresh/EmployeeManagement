import { Directive, Input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/auth.model';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private allowedRoles: UserRole[] = [];
  private isCreated = false;

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    // Re-evaluate whenever user roles signal changes
    effect(() => {
      // Trigger dependency on authService.userRoles
      const _ = this.authService.userRoles();
      this.updateView();
    });
  }

  private updateView(): void {
    const hasPermission = this.authService.hasAnyRole(this.allowedRoles);

    if (hasPermission && !this.isCreated) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isCreated = true;
    } else if (!hasPermission && this.isCreated) {
      this.viewContainer.clear();
      this.isCreated = false;
    }
  }
}
