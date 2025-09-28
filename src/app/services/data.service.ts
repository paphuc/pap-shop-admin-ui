import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);

  products$ = this.productsSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  constructor() {
    // Khởi tạo dữ liệu mẫu
    this.loadInitialData();
  }

  private loadInitialData() {
    const products: Product[] = [
      { id: 'P001', name: 'iPhone 15', price: 25000000, category: 'Điện thoại', stock: 50 },
      { id: 'P002', name: 'Samsung Galaxy S24', price: 22000000, category: 'Điện thoại', stock: 30 },
      { id: 'P003', name: 'MacBook Pro', price: 45000000, category: 'Laptop', stock: 20 }
    ];

    const users: User[] = [
      { id: 'U001', name: 'Admin User', email: 'admin@pap.com', role: 'admin', status: 'active', createdAt: new Date('2024-01-01') },
      { id: 'U002', name: 'Manager User', email: 'manager@pap.com', role: 'manager', status: 'active', createdAt: new Date('2024-01-15') }
    ];

    this.productsSubject.next(products);
    this.usersSubject.next(users);
  }

  // Product methods
  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  addProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    product.id = 'P' + String(currentProducts.length + 1).padStart(3, '0');
    this.productsSubject.next([...currentProducts, product]);
  }

  updateProduct(product: Product): void {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      currentProducts[index] = product;
      this.productsSubject.next([...currentProducts]);
    }
  }

  deleteProduct(id: string): void {
    const currentProducts = this.productsSubject.value;
    this.productsSubject.next(currentProducts.filter(p => p.id !== id));
  }

  // User methods
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  addUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    user.id = 'U' + String(currentUsers.length + 1).padStart(3, '0');
    user.createdAt = new Date();
    this.usersSubject.next([...currentUsers, user]);
  }

  updateUser(user: User): void {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      currentUsers[index] = user;
      this.usersSubject.next([...currentUsers]);
    }
  }

  deleteUser(id: string): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next(currentUsers.filter(u => u.id !== id));
  }
}