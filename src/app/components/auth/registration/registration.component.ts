import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';
import { Subject, map, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (this.userService.googleToken) {
      const token = this.userService.googleToken;
      this.authService.clearUserCookie();
      fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.register(data.email, '', '');
        })
        .catch((error) => {
          alert('Something went wrong. Please try again later.');
          console.error('Error fetching user info:', error);
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();

  regForm = this.fb.group({
    email: new FormControl('test@gmail.com', [
      Validators.required,
      Validators.email,
      Validators.maxLength(128),
    ]),
    password: new FormControl('test', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(128),
    ]),
    confirmPassword: new FormControl('test', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(128),
    ]),
  });

  submit() {
    if (!this.regForm.valid) {
      alert('Some fields are not correct.');
      return;
    }
    const controls = this.regForm.controls;
    if (controls.password.value !== controls.confirmPassword.value) {
      alert('Password and confirm password should be the same.');
      return;
    }
    this.register(controls.email.value!, controls.password.value!, '');
  }

  register(email: string, password: string, data: string) {
    if (!email) return;
    this.authService
      .registerUser(email, password, data)
      .pipe(
        map((result) => result),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        if (result.data) {
          alert('You have registered successfully!');
					// redirect to the main page
					this.router.navigate(['']);
          return;
        }
        alert(result.error?.msgUser);
      });
  }

  registerByGoogle() {
    // Construct the OAuth URL
    const clientId = environment.googleOAuthClientID;
    const redirectUri = environment.googleRedirectUri; // app's callback URL
    const scope = 'email'; // Requested scopes separated by whitespace

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=token`;

    this.authService.saveBackRoute(this.router.url);
    // Redirect the user to the Google login page
    window.location.href = authUrl;
  }

  registerByFacebook() {}
}
