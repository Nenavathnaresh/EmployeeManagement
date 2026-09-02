import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { UserRole } from '../../../core/models/auth.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css"
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.authService.setDemoRole(role);
  }
}
