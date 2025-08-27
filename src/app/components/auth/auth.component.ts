import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;

  authForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.authForm = new FormGroup({
      name: new FormControl('', []), // initially empty
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    const nameControl = this.authForm.get('name');
    if (this.isLoginMode) {
      nameControl?.reset();
      nameControl?.clearValidators();
    } else {
      nameControl?.setValidators([Validators.required]);
    }
    nameControl?.updateValueAndValidity();
  }

  submit(): void {
    if (this.authForm.invalid) return;

    const formValue = this.authForm.getRawValue();
    const name = formValue.name || '';
    const email = formValue.email;
    const password = formValue.password;

    if (this.isLoginMode) {
      this.authService.login({ email, password }).subscribe({
        next: (res: any) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/profile']);
          } else {
            alert('Login failed: Token missing');
          }
        },
        error: (err) => alert(err.error?.message || 'Login failed'),
      });
    } else {
      this.authService.register({ name, email, password }).subscribe({
        next: (res: any) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            this.router.navigate(['/profile']);
          } else {
            alert('Registration failed: Token missing');
          }
        },
        error: (err) => alert(err.error?.message || 'Registration failed'),
      });
    }
  }
}
