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
    console.log('API Service - Token:', token ? 'exists' : 'not found');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
    console.log('API Service - Headers:', headers);
    return headers;
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
    return this.http.delete(`${this.baseUrl}/products/${id}`, { headers: this.getHeaders(), responseType: 'text' });
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

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/${id}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/category`, category, { headers: this.getHeaders() });
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category/${id}`, category, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/${id}`, { headers: this.getHeaders() });
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

  // User management endpoints
  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user`, { headers: this.getHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/admin/create`, user, { headers: this.getHeaders() });
  }

  updateUserRole(userId: number, roleId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/admin/${userId}/role`, roleId, { headers: this.getHeaders() });
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/admin/${userId}/status`, {}, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/admin/${userId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  // Product export/import endpoints
  exportProducts(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/products/export`, { 
      headers: this.getHeaders(), 
      responseType: 'blob' 
    });
  }

  importProducts(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers: { [key: string]: string } = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post(`${this.baseUrl}/products/import`, formData, { headers, responseType: 'text' });
  }

  downloadProductTemplate(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/products/template`, { 
      headers: this.getHeaders(), 
      responseType: 'blob' 
    });
  }

  // Order management endpoints
  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/admin/all`, { headers: this.getHeaders() });
  }

  getOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders/${orderId}`, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status?status=${status}`, {}, { headers: this.getHeaders() });
  }

  // User profile endpoints
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/profile`, { headers: this.getHeaders() });
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${id}`, { headers: this.getHeaders() });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update`, user, { headers: this.getHeaders() });
  }

  // Role management endpoints
  updateRole(role: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/role/update`, role, { headers: this.getHeaders() });
  }

  // Product by category
  getProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/category/${categoryId}`);
  }

  // Product images management
  getProductImages(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/products/${productId}/images`, { headers: this.getHeaders() });
  }

  addProductImage(productId: number, imageUrl: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/products/${productId}/images`, { imageUrl }, { headers: this.getHeaders() });
  }

  deleteProductImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/images/${imageId}`, { headers: this.getHeaders() });
  }

  // Reviews management endpoints
  getProductReviews(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reviews/products/${productId}`);
  }

  addReview(productId: number, review: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reviews/products/${productId}`, review, { headers: this.getHeaders() });
  }

  updateReview(reviewId: number, review: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/reviews/${reviewId}`, review, { headers: this.getHeaders() });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reviews/${reviewId}`, { headers: this.getHeaders() });
  }

  // Password management endpoints
  changePassword(passwordData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update/password`, passwordData, { headers: this.getHeaders(), responseType: 'text' });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/forgot-password`, { email }, { responseType: 'text' });
  }

  validateResetCode(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/validate-reset-code`, { code }, { responseType: 'text' });
  }

  resetPassword(resetData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/reset-password`, resetData, { responseType: 'text' });
  }
}