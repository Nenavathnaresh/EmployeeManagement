import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });
  loading = false;
  showPassword = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    const savedEmail = localStorage.getItem('emp_remembered_email');
    const savedPassword = localStorage.getItem('emp_remembered_password');
    if (savedEmail || savedPassword) {
      this.loginForm.patchValue({
        email: savedEmail || '',
        password: savedPassword || '',
        rememberMe: true
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  hasError(controlName: string, errorName: string): boolean {
    const c = this.loginForm.get(controlName);
    return !!(c && c.hasError(errorName) && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      const { email, password, rememberMe } = this.loginForm.value;
      if (rememberMe) {
        localStorage.setItem('emp_remembered_email', email);
        localStorage.setItem('emp_remembered_password', password);
      } else {
        localStorage.removeItem('emp_remembered_email');
        localStorage.removeItem('emp_remembered_password');
      }

      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.loading = false,
        error: () => this.loading = false
      });
    }
  }
}
