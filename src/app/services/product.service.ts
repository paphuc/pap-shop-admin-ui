import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: number;
  stock: number;
  description: string;
  sku: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private apiService: ApiService) {}

  getAllProducts(): Observable<Product[]> {
    return this.apiService.getProducts();
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.apiService.searchProducts(name);
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.getProduct(id);
  }

  createProduct(product: Product): Observable<Product> {
    return this.apiService.addProduct(product);
  }

  updateProduct(sku: string, product: Product): Observable<Product> {
    return this.apiService.updateProduct(sku, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.apiService.deleteProduct(id);
  }

  exportProducts(): Observable<Blob> {
    return this.apiService.exportProducts();
  }

  importProducts(file: File): Observable<any> {
    return this.apiService.importProducts(file);
  }

  downloadTemplate(): Observable<Blob> {
    return this.apiService.downloadProductTemplate();
  }
}