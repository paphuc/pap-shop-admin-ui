import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Quản lý Danh mục</h5>
              <button class="btn btn-primary" (click)="showAddForm = true">
                <i class="fas fa-plus"></i> Thêm danh mục
              </button>
            </div>
            <div class="card-body">
              <!-- Add/Edit Form -->
              <div *ngIf="showAddForm || editingCategory" class="mb-4">
                <div class="card">
                  <div class="card-header">
                    <h6>{{ editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới' }}</h6>
                  </div>
                  <div class="card-body">
                    <form (ngSubmit)="saveCategory()">
                      <div class="mb-3">
                        <label class="form-label">Tên danh mục</label>
                        <input type="text" class="form-control" [(ngModel)]="categoryForm.name" name="name" required>
                      </div>
                      <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success">
                          {{ editingCategory ? 'Cập nhật' : 'Thêm' }}
                        </button>
                        <button type="button" class="btn btn-secondary" (click)="cancelForm()">Hủy</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Categories Table -->
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên danh mục</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let category of categories">
                      <td>{{ category.id }}</td>
                      <td>{{ category.name }}</td>
                      <td>
                        <button class="btn btn-sm btn-warning me-2" (click)="editCategory(category)">
                          <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-danger" (click)="deleteCategory(category.id)">
                          <i class="fas fa-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  showAddForm = false;
  editingCategory: any = null;
  categoryForm = { name: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  saveCategory() {
    if (this.editingCategory) {
      this.apiService.updateCategory(this.editingCategory.id, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (error) => console.error('Error updating category:', error)
      });
    } else {
      this.apiService.addCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelForm();
        },
        error: (error) => console.error('Error adding category:', error)
      });
    }
  }

  editCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm = { name: category.name };
    this.showAddForm = false;
  }

  deleteCategory(id: number) {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingCategory = null;
    this.categoryForm = { name: '' };
  }
}