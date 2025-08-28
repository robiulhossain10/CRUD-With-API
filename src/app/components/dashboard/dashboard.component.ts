import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: any[] = []; // সবসময় খালি array দিয়ে শুরু
  totalUsers: number = 0;
  activeUsers: number = 0;
  currentUser: any = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCurrentUser();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res || []; // যদি null/undefined হয়, খালি array assign হবে
        this.totalUsers = this.users.length;
        this.activeUsers = this.users.filter((u) => u.active).length;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.users = []; // fallback
      },
    });
  }

  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.currentUser = res || null;
      },
      error: (err) => {
        console.error('Error loading current user:', err);
        this.currentUser = null;
      },
    });
  }

  goToProfile(): void {
    // এখানে router.navigate(['/profile']); দিতে পারো
    console.log('Go to profile page');
  }

  logout(): void {
    this.userService.logout();
    console.log('Logged out');
  }
}
