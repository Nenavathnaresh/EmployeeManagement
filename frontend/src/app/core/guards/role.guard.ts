import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string | string[];

  if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) {
    return true;
  }

  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  notificationService.showWarning('Unauthorized', 'You do not possess the required role to access this area.');
  router.navigate(['/unauthorized']);
  return false;
};
