import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequestDTO, AuthResponseDTO, UserSession, UserRole } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'emp_auth_token';
  private readonly USER_KEY = 'emp_user_session';

  private get authUrl(): string {
    return environment.api?.login || '/api/v1/auth/login';
  }

  // Reactive state management using Angular Signals
  currentUser = signal<UserSession | null>(this.getStoredUser());
  isMockMode = signal<boolean>(false);

  // Computed signals
  isAuthenticated = computed(() => !!this.currentUser());
  userRoles = computed(() => this.currentUser()?.role || '');

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  login(credentials: LoginRequestDTO): Observable<ApiResponse<AuthResponseDTO>> {
    const payload = {
      email: credentials.email || credentials.username,
      password: credentials.password
    };

    return this.http.post<any>(`${this.authUrl}`, payload).pipe(
      tap(res => {
        if (res && res.success && res.data) {
          this.handleAuthSuccess(res.data);
        } else if (res && res.token) {
          this.handleAuthSuccess(res as AuthResponseDTO);
        }
      }),
      catchError(err => {
        console.error("API Call Error", err);
        if (err.status === 0 || err.status === 404) {
          this.isMockMode.set(true);
          const mockAuth = this.createMockSession(credentials.username || credentials.email || 'admin');
          const mockResponse: ApiResponse<AuthResponseDTO> = {
            success: true,
            message: 'Authenticated successfully (Mock Mode)',
            data: mockAuth,
            timestamp: new Date().toISOString()
          };
          this.handleAuthSuccess(mockAuth);
          return of(mockResponse);
        }
        return throwError(() => err);
      })
    );
  }

  register(userData: any): Observable<ApiResponse<AuthResponseDTO>> {
    const registerUrl = environment.api?.register || '/api/v1/auth/register';
    return this.http.post<any>(registerUrl, userData).pipe(
      tap(res => {
        if (res && res.success && res.data) {
          // this.handleAuthSuccess(res.data);
          this.notificationService.showSuccess('Register', `${res.message} , Please Login`);
          this.router.navigate(['/login']);
        } else if (res && res.token) {
          // this.handleAuthSuccess(res as AuthResponseDTO);
          this.notificationService.showSuccess('Register', `${res.message} , Please Login`);
          this.router.navigate(['/login']);
        }
      }),
      catchError(err => {
        if (err.status === 0 || err.status === 404) {
          this.isMockMode.set(true);
          const mockAuth = this.createMockSession(userData.username || 'user');
          const mockResponse: ApiResponse<AuthResponseDTO> = {
            success: true,
            message: 'Registered successfully (Mock Mode)',
            data: mockAuth,
            timestamp: new Date().toISOString()
          };
          this.handleAuthSuccess(mockAuth);
          return of(mockResponse);
        }
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.notificationService.showInfo('Logged Out', 'Your session has ended successfully.');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(role: string): boolean {
    const currentRole = this.userRoles();
    if (!currentRole) return false;
    const cleanCurrent = currentRole.replace('ROLE_', '');
    const cleanTarget = role.replace('ROLE_', '');
    return cleanCurrent === cleanTarget;
  }

  hasAnyRole(roles: string | string[]): boolean {
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.some(r => this.hasRole(r));
  }

  setDemoRole(role: UserRole): void {
    const current = this.currentUser();
    if (current) {
      const updated: UserSession = {
        ...current,
        role: role
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      this.currentUser.set(updated);
      this.notificationService.showSuccess('Role Switched', `Active role changed to ${role}`);
    }
  }

  switchMockRole(role: UserRole): void {
    this.setDemoRole(role);
  }

  private handleAuthSuccess(authData: AuthResponseDTO): void {
    const session: UserSession = {
      id: authData.id,
      username: authData.username,
      email: authData.email,
      role: authData.role,
      token: authData.token
    };

    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(session));
    this.currentUser.set(session);

    this.notificationService.showSuccess('Welcome', `Logged in as ${session.username}`);
    this.router.navigate(['/dashboard']);
  }

  private getStoredUser(): UserSession | null {
    const stored = localStorage.getItem(this.USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private createMockSession(username: string): AuthResponseDTO {
    let roles = 'ADMIN';
    if (username.toLowerCase().includes('manager')) {
      roles = 'MANAGER';
    } else if (username.toLowerCase().includes('employee') || username.toLowerCase().includes('user')) {
      roles = 'EMPLOYEE';
    }

    return {
      token: `mock-jwt-token-header.${btoa(JSON.stringify({ sub: username, role: roles }))}.signature`,
      id: Math.floor(Math.random() * 1000) + 1,
      username: username || 'admin',
      email: `${username || 'admin'}@enterprise.com`,
      role: roles
    };
  }
}
