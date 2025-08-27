import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.currentUser$.value;
    if (user?.role === 'admin') return true;

    this.router.navigate(['/login']); // redirect if not admin
    return false;
  }
}
