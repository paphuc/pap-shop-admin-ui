import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RoleService } from '../services/role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private roleService: RoleService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    
    if (!this.roleService.isAdmin()) {
      alert('Bạn không có quyền truy cập trang admin!');
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}