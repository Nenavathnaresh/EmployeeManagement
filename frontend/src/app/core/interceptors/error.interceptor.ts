import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred.';
      let errorTitle = 'Error';

      if (error.error) {
        // Standardized Spring Boot ApiResponse error format
        if (typeof error.error === 'object') {
          console.log(error.error)
          if (error.error.message) {
            errorMessage = error.error.message;
          }
          if (error.error.errors?.length > 0) {
            if (typeof error.error.errors === 'object' && !Array.isArray(error.error.errors)) {
              const fieldErrors = Object.entries(error.error.errors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join(', ');
              errorMessage = `Validation failed: ${fieldErrors}`;
            } else if (Array.isArray(error.error.errors)) {
              errorMessage = error.error.errors.join(', ');
            }
          }
        }
      }

      switch (error.status) {
        case 401:
          errorTitle = `${error.status} - Unauthorized`;
          errorMessage = error.error.message;
          break;
        case 403:
          errorTitle = `${error.status} - Forbidden`;
          errorMessage = error.error.message;
          break;
        case 400:
          errorTitle = `${error.status} - Bad Request`;
          errorMessage = error.error.message;
          break;
        case 404:
          errorTitle = `${error.status} - Not Found`;
          errorMessage = error.error.message;
          break;
        case 500:
          errorTitle = `${error.status} - Internal Server Error`;
          errorMessage = error.error.message;
          break;
        case 502:
          errorTitle = `${error.status} - Bad Gateway`;
          errorMessage = error.error.message;
          break;
      }

      // Show toast alert unless in mock fallback scenario
      if (error.status !== 0) {
        console.log(error)
        console.log(errorTitle, errorMessage)
        notificationService.showError(errorTitle, errorMessage);
      }

      return throwError(() => error);
    })
  );
};
