import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-crud',
  templateUrl: './user-crud.component.html',
})
export class UserCrudComponent implements OnInit {
  users: any[] = [];
  error = '';
  editingUser: any = null;

  editForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('user', Validators.required),
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (res: any) => (this.users = res),
      error: () => (this.error = 'Could not load users'),
    });
  }

  startEdit(user: any) {
    this.editingUser = user;
    this.editForm.setValue({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    });
  }

  cancelEdit() {
    this.editingUser = null;
  }

  saveEdit() {
    if (this.editForm.invalid || !this.editingUser) return;

    this.userService
      .update(this.editingUser._id, this.editForm.value)
      .subscribe({
        next: () => {
          this.loadUsers();
          this.editingUser = null;
          this.error = '';
        },
        error: () => (this.error = 'Update failed'),
      });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: () => (this.error = 'Delete failed'),
    });
  }
}
