import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Direct API URL (without environment)
  private base = 'https://backend-api-bsa8.onrender.com/api/users';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.base);
  }

  getById(id: string) {
    return this.http.get(`${this.base}/${id}`);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
