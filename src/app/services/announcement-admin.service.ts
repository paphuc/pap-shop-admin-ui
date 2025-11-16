import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnnouncementRequest {
  title: string;
  message: string;
  productId?: number;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  productId?: number;
  productName?: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnouncementAdminService {
  private apiUrl = 'http://localhost:8080/api/announcements';

  constructor(private http: HttpClient) {}

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  createAnnouncement(request: AnnouncementRequest): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, request);
  }

  updateAnnouncement(id: number, request: AnnouncementRequest): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, request);
  }

  toggleActive(id: number): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteAnnouncement(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }
}