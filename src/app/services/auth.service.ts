import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';
  private readonly apiUrl = 'https://backend-api-bsa8.onrender.com/api';
  public currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    const user = localStorage.getItem(this.USER_KEY);
    this.currentUser$.next(user ? JSON.parse(user) : null);
  }

  // ---------------- LOGIN ----------------
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res: any) => {
        if (res?.token && res?.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser$.next(res.user);
        }
      })
    );
  }

  // ---------------- REGISTER ----------------
  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.http
      .post<{ token: string; user: User }>(`${this.apiUrl}/auth/register`, data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  // ---------------- STORE TOKEN & USER ----------------
  private storeAuth(res: { token: string; user: User }): void {
    if (res?.token && res?.user) {
      localStorage.setItem(this.TOKEN_KEY, res.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      this.currentUser$.next(res.user);
    }
  }

  // ---------------- LOGOUT ----------------
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
  }

  // ---------------- TOKEN ----------------
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // ---------------- PROFILE ----------------
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProfile(data: Partial<User> & { password?: string }): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/me`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((user) => {
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUser$.next(user);
        })
      );
  }

  // ---------------- HELPER ----------------
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }
}
