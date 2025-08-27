import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface User {
  _id: string;
  name: string;
  email: string;
  isActive?: boolean;
  role?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  users: User[] = [];
  currentUser: User | null = null; // logged-in user

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Get current logged-in user
    this.auth.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : [];
        this.totalUsers = this.users.length;
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.users = [];
        this.totalUsers = 0;
      },
    });
  }

  get activeUsers(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']); // navigate to profile page
  }
}
