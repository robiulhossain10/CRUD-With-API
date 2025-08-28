import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-jwt-auth';
  // isLogin = false;

  // constructor(private router: Router) {}

  // ngOnInit(): void {
  //   this.login();
  // }
  // login() {
  //   if (this.isLogin) {
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.router.navigate(['/login']);
  //   }
  // }
}
