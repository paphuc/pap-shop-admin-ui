import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: any[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-container">
      <h1>Quản lý đơn hàng</h1>

      <div class="card">
        <h3>Danh sách đơn hàng</h3>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="isLoading">
              <td colspan="6" class="text-center">Đang tải...</td>
            </tr>
            <tr *ngFor="let order of orders" [hidden]="isLoading">
              <td>{{order.id}}</td>
              <td>{{order.customerName}}</td>
              <td>{{order.totalAmount | currency:'VND':'symbol':'1.0-0'}}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(order.status)">
                  {{getStatusText(order.status)}}
                </span>
              </td>
              <td>{{order.createdAt | date:'dd/MM/yyyy HH:mm'}}</td>
              <td>
                <select class="form-control status-select" 
                        [value]="order.status" 
                        (change)="updateStatus(order.id, $event)">
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="SHIPPED">Đã gửi hàng</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="CANCELED">Đã hủy</option>
                </select>
              </td>
            </tr>
            <tr *ngIf="!isLoading && orders.length === 0">
              <td colspan="6" class="text-center">Chưa có đơn hàng nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
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
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-pending { background-color: #ffc107; color: #212529; }
    .status-processing { background-color: #007bff; color: white; }
    .status-shipped { background-color: #6f42c1; color: white; }
    .status-delivered { background-color: #28a745; color: white; }
    .status-canceled { background-color: #dc3545; color: white; }
    .status-select {
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        console.log('API Response:', orders);
        this.orders = orders.map((order: any) => ({
          id: order.id,
          customerName: order.user?.username || 'N/A',
          totalAmount: order.totalPrice || 0,
          status: order.status,
          createdAt: order.createdAt
        }));
        console.log('Mapped orders:', this.orders);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  updateStatus(orderId: number, event: any) {
    const newStatus = event.target.value;
    this.apiService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        console.log('Order status updated:', updatedOrder);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Lỗi khi cập nhật trạng thái đơn hàng!');
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'SHIPPED': 'Đã gửi hàng',
      'DELIVERED': 'Đã giao hàng',
      'CANCELED': 'Đã hủy'
    };
    return statusMap[status] || status;
  }
}