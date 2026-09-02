import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-card glass-card">
        <div class="error-code">403</div>
        <h2 class="error-title">Access Denied</h2>
        <p class="error-message">
          Your current authority (<strong>{{ authService.userRoles()[0] || 'ROLE_EMPLOYEE' }}</strong>) 
          is not permitted to view this resource.
        </p>

        <div class="actions">
          <a routerLink="/employees" class="btn btn-primary">
            ⬅ Return to Employee Directory
          </a>
          <button class="btn btn-outline" (click)="switchAdmin()">
            👑 Switch to ROLE_ADMIN Demo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .unauthorized-card {
      max-width: 480px;
      padding: 2.5rem;
      text-align: center;
    }

    .error-code {
      font-size: 4rem;
      font-weight: 900;
      color: var(--danger);
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .error-message {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0.85rem 0 1.75rem 0;
      line-height: 1.5;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `]
})
export class UnauthorizedComponent {
  authService = inject(AuthService);

  switchAdmin(): void {
    this.authService.switchMockRole('ROLE_ADMIN');
  }
}
