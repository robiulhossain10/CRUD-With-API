import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Direct API URL (without environment)
  private base = 'https://backend-api-bsa8.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  // ✅ Dashboard এর জন্য ব্যবহার হবে
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`); // তোমার backend এ /me endpoint থাকতে হবে
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  // ✅ CRUD Methods
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
}
