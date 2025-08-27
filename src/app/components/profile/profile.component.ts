import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  name: string;
  email: string;
  password: string; // password now mandatory
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required), // ✅ mandatory
  });

  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (res: any) => {
        // Ensure res has name and email
        this.profileForm.patchValue({
          name: res?.name || '',
          email: res?.email || '',
        });
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Could not load profile';
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.error = 'All fields including password are required';
      return;
    }

    const formValue = this.profileForm.value as User;

    const updateData: Partial<User> & { password: string } = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password, // mandatory
    };

    this.auth.updateProfile(updateData).subscribe({
      next: (res: any) => {
        // Ensure res has name & email
        this.message = 'Profile updated successfully';
        this.error = '';

        this.profileForm.patchValue({
          name: res?.name || this.profileForm.value.name,
          email: res?.email || this.profileForm.value.email,
        });

        // Clear password field after update
        this.profileForm.get('password')?.reset();
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Update failed';
        this.message = '';
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
