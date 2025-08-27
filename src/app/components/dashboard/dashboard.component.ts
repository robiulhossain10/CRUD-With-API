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
  currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Get logged-in user
    this.auth.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (res: any) => {
        // Safety check: ensure res is an array
        if (!Array.isArray(res)) {
          console.error('Expected array from API, got:', res);
          this.users = [];
          this.totalUsers = 0;
          return;
        }

        // Map users with isActive from backend
        this.users = res.map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          isActive: typeof user.isActive === 'boolean' ? user.isActive : false,
        }));

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
    this.router.navigate(['/profile']);
  }
}
