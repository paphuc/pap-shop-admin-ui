import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private userRoleSubject = new BehaviorSubject<string>('');
  public userRole$ = this.userRoleSubject.asObservable();

  constructor() {
    this.loadUserRole();
  }

  private loadUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.scope || '';
        this.userRoleSubject.next(role);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  isAdmin(): boolean {
    return this.userRoleSubject.value === 'ADMIN';
  }

  clearRole() {
    this.userRoleSubject.next('');
  }
}