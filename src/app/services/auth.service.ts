import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private apiService: ApiService, private roleService: RoleService) {
    const hasToken = this.hasToken();
    console.log('AuthService initialized, has token:', hasToken);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(hasToken);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    console.log('Checking token:', token ? 'exists' : 'not found');
    return !!token;
  }

  login(credentials: any): Observable<any> {
    return this.apiService.login(credentials).pipe(
      tap(token => {
        if (token) {
          localStorage.setItem('token', token);
          this.isLoggedInSubject.next(true);
          // Parse token để lấy role
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.roleService.setUserRole(payload.scope || '');
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.apiService.logout().pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
      })
    );
  }

  logoutLocal(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.roleService.clearRole();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const authenticated = this.hasToken();
    console.log('Is authenticated:', authenticated);
    return authenticated;
  }
}