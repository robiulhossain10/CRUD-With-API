import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly REFRESH_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';
  private readonly apiUrl = 'https://backend-api-bsa8.onrender.com/api';

  public currentUser$ = new BehaviorSubject<User | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  // ---------------- LOGIN ----------------
  login(data: { email: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  // ---------------- REGISTER ----------------
  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, data)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  // ---------------- LOGOUT ----------------
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(
          `${this.apiUrl}/auth/logout`,
          {},
          { headers: new HttpHeaders({ 'x-refresh-token': refreshToken }) }
        )
        .subscribe({ next: () => console.log('Logged out from server') });
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
  }

  // ---------------- TOKEN ----------------
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ---------------- REFRESH ----------------
  refreshToken(): Observable<{
    token: string;
    refreshToken: string;
    user: User;
  }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token found');

    return this.http
      .post<{ token: string; refreshToken: string; user: User }>(
        `${this.apiUrl}/auth/refresh`,
        {},
        { headers: new HttpHeaders({ 'x-refresh-token': refreshToken }) }
      )
      .pipe(
        tap((res) => {
          if (res.token) localStorage.setItem(this.TOKEN_KEY, res.token);
          if (res.refreshToken)
            localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
          if (res.user) this.storeUser(res.user);
          console.log('🔄 Token refreshed and user updated');
        })
      );
  }

  // ---------------- PROFILE ----------------
  getProfile(): Observable<User> {
    return this.http.get<User>(
      `${this.apiUrl}/users/me`,
      this.getAuthOptions()
    );
  }

  updateProfile(data: Partial<User> & { password?: string }): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/me`, data, this.getAuthOptions())
      .pipe(tap((user) => this.storeUser(user)));
  }

  // ---------------- PRIVATE HELPERS ----------------
  private getStoredUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private storeAuth(res: any): void {
    const token = res.token;
    const refreshToken = res.refreshToken;
    const user = res.user;

    if (token && refreshToken && user) {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.REFRESH_KEY, refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser$.next(user);
    }
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser$.next(user);
  }

  private getAuthOptions(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }),
    };
  }
}
