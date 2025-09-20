import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Đăng nhập Admin</h2>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Email/Số điện thoại/Tên đăng nhập" 
                   [(ngModel)]="credentials.emailOrPhoneOrUsername" name="emailOrPhoneOrUsername" required>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Mật khẩu" 
                   [(ngModel)]="credentials.password" name="password" required>
          </div>
          <div *ngIf="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
          <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading">
            <span *ngIf="isLoading">Đang đăng nhập...</span>
            <span *ngIf="!isLoading">Đăng nhập</span>
          </button>
        </form>
        <div class="demo-info">
          <p><strong>Demo:</strong></p>
          <p>Email: admin@pap.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 0;
    }
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 400px;
      text-align: center;
    }
    .btn-block {
      width: 100%;
    }
    .demo-info {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
      font-size: 14px;
    }
    .alert {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  credentials = { emailOrPhoneOrUsername: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (!this.credentials.emailOrPhoneOrUsername || !this.credentials.password) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('Sending login request:', this.credentials);
    this.authService.login(this.credentials).subscribe({
      next: (token) => {
        console.log('Login successful, token:', token);
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Email hoặc mật khẩu không đúng!';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}