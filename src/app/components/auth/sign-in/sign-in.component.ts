import { Component, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { DynamicComponentService } from '../../../services/dynamic-component.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, map, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Result } from '../../../models/result';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      state('*', style({ opacity: 1 })),
    ]),
  ],
})
export class SignInComponent implements OnDestroy {
  constructor(
    private dynamicComponentService: DynamicComponentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  private destroy$ = new Subject<void>();

  email = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(4),
    Validators.maxLength(128),
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(128),
  ]);

	submit() {
    if (!this.areFieldsValid()) return;
    this.signIn(this.email.value!, this.password.value!, false);
  }

  signIn(email: string, password: string, socialLogin: boolean) {
    this.authService
      .signIn(email, password, socialLogin)
      .pipe(
        map((result) => result),
        takeUntil(this.destroy$)
      )
      .subscribe((result) => {
        this.processResult(result);
      });
  }

  signInWithGoogle(): void {
    // Construct the OAuth URL
    const clientId = environment.oAuthClientID;
    const redirectUri = 'http://store-foxminded.lovestoblog.com/google-callback'; // app's callback URL
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

  private processResult(result: Result) {
    if (result.error) {
      alert(result.error.msgUser);
      console.error(result.error.msgDev);
      return;
    }
    window.location.reload();
  }

  goToRegistrationPage() {
    this.close();
    this.router.navigate(['/registration']);
  }

  close() {
    this.dynamicComponentService.removeComponents(SignInComponent);
  }

  private areFieldsValid(): boolean {
    if (!this.email.valid) {
      alert('Email format is not correct');
      return false;
    }
    if (!this.password.valid) {
      alert('Password format is not correct');
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
