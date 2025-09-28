import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{stats.totalProducts}}</div>
        <div class="stat-label">Tổng sản phẩm</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{stats.totalUsers}}</div>
        <div class="stat-label">Tổng người dùng</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{stats.totalOrders}}</div>
        <div class="stat-label">Tổng đơn hàng</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{stats.revenue | currency:'VND':'symbol':'1.0-0'}}</div>
        <div class="stat-label">Doanh thu</div>
      </div>
    </div>

    <div class="card">
      <h3>Đơn hàng gần đây</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="isLoading">
            <td colspan="5" class="text-center">Đang tải...</td>
          </tr>
          <tr *ngFor="let order of recentOrders" [hidden]="isLoading">
            <td>{{order.id}}</td>
            <td>{{order.customer}}</td>
            <td>{{order.total | currency:'VND':'symbol':'1.0-0'}}</td>
            <td>{{order.status}}</td>
            <td>{{order.date | date:'dd/MM/yyyy'}}</td>
          </tr>
          <tr *ngIf="!isLoading && recentOrders.length === 0">
            <td colspan="5" class="text-center">Chưa có đơn hàng nào</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
      max-width: 600px;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
    }
    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }
    h3 {
      margin-top: 0;
      color: #333;
    }
    .text-center {
      text-align: center;
      padding: 20px;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  };

  recentOrders: any[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load stats
    this.apiService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    // Load recent orders
    this.apiService.getRecentOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.map((order: any) => ({
          id: 'ORD' + String(order.id).padStart(3, '0'),
          customer: order.user?.name || 'N/A',
          total: order.totalPrice,
          status: this.getStatusText(order.status),
          date: new Date(order.createdAt)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Đang xử lý',
      'CONFIRMED': 'Đã xác nhận',
      'SHIPPED': 'Đang giao',
      'DELIVERED': 'Đã giao',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  }
}