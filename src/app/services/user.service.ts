import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = 'https://backend-api-bsa8.onrender.com/api/users';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // ---------------- HTTP OPTIONS WITH TOKEN ----------------
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }),
    };
  }

  // ---------------- DASHBOARD / USERS ----------------
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.base, this.getAuthHeaders());
  }

  // Add new user
  create(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.base, user, this.getAuthHeaders());
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.base}/me`, this.getAuthHeaders());
  }

  // ---------------- CRUD METHODS ----------------
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.base, this.getAuthHeaders());
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/${id}`, this.getAuthHeaders());
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.base}/${id}`,
      data,
      this.getAuthHeaders()
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`, this.getAuthHeaders());
  }

  // ---------------- LOGOUT ----------------
  logout(): void {
    this.auth.logout();
  }
}
