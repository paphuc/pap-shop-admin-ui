import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementAdminService, Announcement, AnnouncementRequest } from '../services/announcement-admin.service';

@Component({
  selector: 'app-announcement-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './announcement-admin.component.html',
  styleUrls: ['./announcement-admin.component.css']
})
export class AnnouncementAdminComponent implements OnInit {
  announcements: Announcement[] = [];
  announcementForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementAdminService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      message: ['', [Validators.required]],
      productId: [null]
    });
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.loading = true;
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        alert('Lỗi khi tải danh sách thông báo');
        this.loading = false;
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.announcementForm.reset();
    this.showForm = true;
  }

  openEditForm(announcement: Announcement): void {
    this.isEditing = true;
    this.editingId = announcement.id;
    this.announcementForm.patchValue({
      title: announcement.title,
      message: announcement.message,
      productId: announcement.productId
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.announcementForm.reset();
  }

  onSubmit(): void {
    if (this.announcementForm.invalid) {
      return;
    }

    const request: AnnouncementRequest = this.announcementForm.value;

    if (this.isEditing && this.editingId) {
      this.announcementService.updateAnnouncement(this.editingId, request).subscribe({
        next: () => {
          alert('Cập nhật thông báo thành công!');
          this.loadAnnouncements();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating announcement:', error);
          alert('Lỗi khi cập nhật thông báo');
        }
      });
    } else {
      this.announcementService.createAnnouncement(request).subscribe({
        next: () => {
          alert('Tạo thông báo thành công! Thông báo đã được gửi đến tất cả người dùng.');
          this.loadAnnouncements();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating announcement:', error);
          alert('Lỗi khi tạo thông báo');
        }
      });
    }
  }

  toggleActive(announcement: Announcement): void {
    const action = announcement.isActive ? 'tắt' : 'bật';
    if (confirm(`Bạn có chắc muốn ${action} thông báo này?`)) {
      this.announcementService.toggleActive(announcement.id).subscribe({
        next: () => {
          alert(`Đã ${action} thông báo thành công!`);
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Error toggling announcement:', error);
          alert('Lỗi khi thay đổi trạng thái thông báo');
        }
      });
    }
  }

  deleteAnnouncement(id: number): void {
    if (confirm('Bạn có chắc muốn xóa thông báo này?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          alert('Xóa thông báo thành công!');
          this.loadAnnouncements();
        },
        error: (error) => {
          console.error('Error deleting announcement:', error);
          alert('Lỗi khi xóa thông báo');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('vi-VN');
  }
}