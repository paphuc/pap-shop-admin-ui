import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn$ | async">
      <div class="container">
        <div class="navbar-brand">
          <h3>PAP Shop Admin</h3>
        </div>
        <ul class="navbar-nav">
          <li><a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a></li>
          <li><a routerLink="/products" routerLinkActive="active" class="nav-link">Sản phẩm</a></li>
          <li><a routerLink="/categories" routerLinkActive="active" class="nav-link">Danh mục</a></li>
          <li><a routerLink="/orders" routerLinkActive="active" class="nav-link">Đơn hàng</a></li>
          <li><a routerLink="/users" routerLinkActive="active" class="nav-link">Người dùng</a></li>
          <li><a routerLink="/announcements" routerLinkActive="active" class="nav-link">Thông báo</a></li>
        </ul>
        <div class="navbar-actions">
          <button class="btn btn-outline-light" (click)="logout()">Đăng xuất</button>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      background-color: #343a40;
      padding: 1rem 0;
      margin-bottom: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .container:not(.navbar .container) {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .navbar-brand h3 {
      color: white;
      margin: 0;
    }
    .navbar-nav {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    .nav-link {
      color: #adb5bd;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;
    }
    .nav-link:hover, .nav-link.active {
      color: white;
      background-color: #495057;
    }
    .navbar-actions .btn {
      padding: 0.5rem 1rem;
      border: 1px solid #6c757d;
      background: transparent;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .navbar-actions .btn:hover {
      background-color: #6c757d;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'PAP Shop Admin';
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    // Removed auto redirect logic
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Fallback to local logout if API fails
        this.authService.logoutLocal();
        this.router.navigate(['/login']);
      }
    });
  }
}