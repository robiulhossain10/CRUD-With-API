import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;

    const data = this.form.getRawValue(); // { email: string, password: string }

    this.auth.login(data).subscribe({
      next: (res: { token: string; refreshToken: string; user: User }) => {
        // Current user set
        this.auth.currentUser$.next(res.user);

        // Role based navigation
        if (res.user.role === 'admin') {
          this.router.navigate(['/dashboard']); // Admin Dashboard
        } else if (res.user.role === 'user') {
          this.router.navigate(['/userhome']); // User home page
        } else {
          this.router.navigate(['/']); // Default fallback
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
      },
    });
  }
}
