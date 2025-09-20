import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: number;
  category?: string;
  stock: number;
  image?: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="products-container">
      <h1>Quản lý sản phẩm</h1>

      <div class="card">
        <h3>{{isEditing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}}</h3>
        <form (ngSubmit)="saveProduct()">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Tên sản phẩm" 
                   [(ngModel)]="currentProduct.name" name="name" required>
          </div>
          <div class="form-group">
            <label>Giá (VND)</label>
            <input type="number" class="form-control" placeholder="Nhập giá sản phẩm" 
                   [(ngModel)]="currentProduct.price" name="price" required min="0">
          </div>
          <div class="form-group">
            <label>Danh mục</label>
            <select class="form-control" [(ngModel)]="currentProduct.categoryId" name="categoryId" required>
              <option value="0">- Chọn danh mục -</option>
              <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Số lượng tồn kho</label>
            <input type="number" class="form-control" placeholder="Nhập số lượng" 
                   [(ngModel)]="currentProduct.stock" name="stock" required min="0">
          </div>
          <button type="submit" class="btn btn-primary">{{isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}}</button>
          <button type="button" class="btn" (click)="resetForm()" *ngIf="isEditing">Hủy</button>
        </form>
      </div>

      <div class="card" *ngIf="!isEditing">
        <h3>Upload ảnh sản phẩm</h3>
        <form (ngSubmit)="uploadImage()">
          <div class="form-group">
            <select class="form-control" [(ngModel)]="selectedProductId" name="selectedProductId" required>
              <option value="">- Chọn sản phẩm -</option>
              <option *ngFor="let product of products" [value]="product.id">{{product.name}}</option>
            </select>
          </div>
          <div class="form-group">
            <input type="file" class="form-control" (change)="onFileSelect($event)" accept="image/*" required>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="!selectedFile || !selectedProductId">Upload ảnh</button>
        </form>
      </div>

      <div class="card">
        <h3>Danh sách sản phẩm</h3>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="6" class="text-center">Đang tải...</td>
            </tr>
            <tr *ngFor="let product of products" [hidden]="isLoading">
              <td>{{product.id}}</td>
              <td>{{product.name}}</td>
              <td>{{product.price | currency:'VND':'symbol':'1.0-0'}}</td>
              <td>{{product.category}}</td>
              <td>{{product.stock}}</td>
              <td>
                <button class="btn btn-primary" (click)="editProduct(product)">Sửa</button>
                <button class="btn btn-danger" (click)="deleteProduct(product.id)">Xóa</button>
              </td>
            </tr>
            <tr *ngIf="!isLoading && products.length === 0">
              <td colspan="6" class="text-center">Chưa có sản phẩm nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-right: 10px;
      font-size: 14px;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-danger {
      background-color: #dc3545;
      color: white;
    }
    .btn:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .table th, .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .text-center {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    h3 {
      margin-top: 0;
      color: #333;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  currentProduct: Product = { id: '', name: '', price: null as any, categoryId: 0, stock: null as any };
  selectedFile: File | null = null;
  selectedProductId: string = '';
  isEditing = false;
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          categoryId: p.category?.id || 0,
          category: p.category?.name || 'N/A',
          stock: p.stock || 0
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  saveProduct() {
    if (!this.currentProduct.name || !this.currentProduct.price || !this.currentProduct.categoryId) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const productData = {
      name: this.currentProduct.name,
      price: this.currentProduct.price,
      category: this.currentProduct.categoryId,
      stock: this.currentProduct.stock
    };

    if (this.isEditing) {
      console.log('Update product:', productData);
    } else {
      this.apiService.addProduct(productData).subscribe({
        next: (product) => {
          console.log('Product added:', product);
          this.loadProducts();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Lỗi khi thêm sản phẩm!');
        }
      });
    }
  }

  uploadImage() {
    if (!this.selectedFile || !this.selectedProductId) {
      alert('Vui lòng chọn sản phẩm và file ảnh!');
      return;
    }

    this.apiService.uploadProductImage(Number(this.selectedProductId), this.selectedFile).subscribe({
      next: (response) => {
        console.log('Image uploaded:', response);
        alert('Upload ảnh thành công!');
        this.selectedFile = null;
        this.selectedProductId = '';
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        alert('Lỗi khi upload ảnh!');
      }
    });
  }

  editProduct(product: Product) {
    this.currentProduct = { ...product };
    this.isEditing = true;
  }

  deleteProduct(id: string) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.apiService.deleteProduct(Number(id)).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Lỗi khi xóa sản phẩm!');
        }
      });
    }
  }

  resetForm() {
    this.currentProduct = { id: '', name: '', price: null as any, categoryId: 0, stock: null as any };
    this.isEditing = false;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name);
    }
  }
}