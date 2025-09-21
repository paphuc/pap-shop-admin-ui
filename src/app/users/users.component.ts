import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: any;
  status: string;
  createdAt: Date;
}

interface Role {
  roleId: number;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <h1>Quản lý người dùng</h1>

      <div class="card">
        <h3>Thêm người dùng mới</h3>
        <form (ngSubmit)="addUser()">
          <div class="form-group">
            <label>Tên người dùng</label>
            <input type="text" class="form-control" placeholder="Nhập tên người dùng" 
                   [(ngModel)]="newUser.name" name="name" required>
          </div>
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control" placeholder="Nhập username" 
                   [(ngModel)]="newUser.username" name="username" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" placeholder="Nhập email" 
                   [(ngModel)]="newUser.email" name="email" required>
          </div>
          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="tel" class="form-control" placeholder="Nhập số điện thoại" 
                   [(ngModel)]="newUser.phone" name="phone" required>
          </div>
          <div class="form-group">
            <label>Quyền</label>
            <select class="form-control" [(ngModel)]="newUser.roleId" name="roleId" required>
              <option value="">- Chọn quyền -</option>
              <option *ngFor="let role of roles" [value]="role.roleId">{{role.role}}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Thêm người dùng</button>
        </form>
      </div>

      <div class="card">
        <h3>Danh sách người dùng</h3>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Username</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Quyền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="9" class="text-center">Đang tải...</td>
            </tr>
            <tr *ngFor="let user of users" [hidden]="isLoading">
              <td>{{user.id}}</td>
              <td>{{user.name}}</td>
              <td>{{user.username}}</td>
              <td>{{user.email}}</td>
              <td>{{user.phone}}</td>
              <td>
                <select class="form-control" [(ngModel)]="user.role.roleId" (change)="updateUserRole(user)">
                  <option *ngFor="let role of roles" [value]="role.roleId">{{role.role}}</option>
                </select>
              </td>
              <td>
                <span [class]="'status-' + user.status">{{getStatusText(user.status)}}</span>
              </td>
              <td>{{user.createdAt | date:'dd/MM/yyyy'}}</td>
              <td>
                <button class="btn btn-primary" (click)="toggleUserStatus(user)">
                  {{user.status === 'active' ? 'Khóa' : 'Kích hoạt'}}
                </button>
                <button class="btn btn-danger" (click)="deleteUser(user.id)">Xóa</button>
              </td>
            </tr>
            <tr *ngIf="!isLoading && users.length === 0">
              <td colspan="9" class="text-center">Chưa có người dùng nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
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
    .status-active {
      color: green;
      font-weight: bold;
    }
    .status-inactive {
      color: red;
      font-weight: bold;
    }
    .text-center {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #333;
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
export class UsersComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  newUser: any = { name: '', username: '', email: '', phone: '', roleId: '' };
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles() {
    this.apiService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      }
    });
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((u: any) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status || 'active',
          createdAt: new Date(u.createdAt)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  addUser() {
    if (!this.newUser.name || !this.newUser.username || !this.newUser.email || !this.newUser.phone || !this.newUser.roleId) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const userData = {
      name: this.newUser.name,
      username: this.newUser.username,
      email: this.newUser.email,
      phone: this.newUser.phone,
      role: { roleId: this.newUser.roleId }
    };

    this.apiService.createUser(userData).subscribe({
      next: (user) => {
        console.log('User created:', user);
        this.loadUsers();
        this.newUser = { name: '', username: '', email: '', phone: '', roleId: '' };
        alert('Thêm người dùng thành công!');
      },
      error: (error) => {
        console.error('Error creating user:', error);
        alert('Lỗi khi thêm người dùng!');
      }
    });
  }

  updateUserRole(user: User) {
    this.apiService.updateUserRole(user.id, user.role.roleId).subscribe({
      next: (updatedUser) => {
        console.log('User role updated:', updatedUser);
        alert('Cập nhật quyền thành công!');
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        alert('Lỗi khi cập nhật quyền!');
        this.loadUsers(); // Reload to revert changes
      }
    });
  }

  toggleUserStatus(user: User) {
    this.apiService.toggleUserStatus(user.id).subscribe({
      next: (updatedUser) => {
        user.status = updatedUser.status;
        console.log('User status updated:', updatedUser);
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        alert('Lỗi khi cập nhật trạng thái!');
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          alert('Xóa người dùng thành công!');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Lỗi khi xóa người dùng!');
        }
      });
    }
  }

  getStatusText(status: string): string {
    return status === 'active' ? 'Hoạt động' : 'Bị khóa';
  }
}