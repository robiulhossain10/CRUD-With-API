import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
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

  submit(): void {
    if (this.form.invalid) return;

    const formData: { name: string; email: string; password: string } =
      this.form.getRawValue();

    this.auth.register(formData).subscribe({
      next: () => {
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Registration failed';
      },
    });
  }
}
