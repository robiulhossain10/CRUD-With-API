import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText = '';
  activePage = 'users';
  currentUser: any = null;
  isSidebarOpen = false;
  isDarkMode = true;

  // MODALS
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showSuccessModal = false;

  editingUser: any = null;
  deletingUser: any = null;
  newUser: any = { name: '', email: '', password: '' };

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCurrentUser();
  }

  // ---------------- LOAD USERS ----------------
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res || [];
        this.filteredUsers = [...this.users];
      },
      error: (err) => console.error(err),
    });
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (res) => (this.currentUser = res),
      error: (err) => console.error(err),
    });
  }

  // ---------------- SEARCH ----------------
  filterUsers() {
    if (!this.searchText) this.filteredUsers = [...this.users];
    else {
      const term = this.searchText.toLowerCase();
      this.filteredUsers = this.users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }
  }

  // ---------------- NAV ----------------
  setActive(page: string) {
    this.activePage = page;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // ---------------- MODALS ----------------
  openAddModal() {
    this.newUser = { name: '', email: '', password: '' };
    this.showAddModal = true;
  }

  saveNewUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password)
      return;
    this.userService.create(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.showAddModal = false;
        this.showSuccessModal = true;
      },
      error: (err) => console.error(err),
    });
  }

  openEditModal(user: any) {
    this.editingUser = { ...user };
    this.showEditModal = true;
  }

  saveUser() {
    if (!this.editingUser?._id) return;
    this.userService.update(this.editingUser._id, this.editingUser).subscribe({
      next: () => {
        this.loadUsers();
        this.showEditModal = false;
        this.showSuccessModal = true;
      },
      error: (err) => console.error(err),
    });
  }

  openDeleteModal(user: any) {
    this.deletingUser = user;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.deletingUser?._id) return;
    this.userService.delete(this.deletingUser._id).subscribe({
      next: () => {
        this.loadUsers();
        this.showDeleteModal = false;
        this.showSuccessModal = true;
      },
      error: (err) => console.error(err),
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
