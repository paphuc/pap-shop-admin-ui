import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Auth endpoints
  login(credentials: any): Observable<any> {
    console.log('API Service - Making login request to:', `${this.baseUrl}/user/login`);
    console.log('API Service - Credentials:', credentials);
    return this.http.post(`${this.baseUrl}/user/login`, credentials, { responseType: 'text' });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/logout`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  // Products endpoints
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/products`);
  }

  searchProducts(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/search?name=${name}`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, product, { headers: this.getHeaders() });
  }

  updateProduct(sku: string, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/products/update/${sku}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders() });
  }

  // Roles endpoints
  getRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/role`);
  }

  createRole(role: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/role`, role, { headers: this.getHeaders() });
  }

  // Dashboard endpoints
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }

  getRecentOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/recent-orders`, { headers: this.getHeaders() });
  }

  // Category endpoints
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }

  // Product image upload
  uploadProductImage(productId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post(`${this.baseUrl}/products/${productId}/upload-image`, formData, { headers });
  }
}