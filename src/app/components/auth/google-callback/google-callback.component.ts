import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserCookie } from '../../../models/user-cookie';
import { Subject, map, takeUntil } from 'rxjs';
import { Result } from '../../../models/result';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [],
  templateUrl: './google-callback.component.html',
  styleUrl: './google-callback.component.scss',
})
export class GoogleCallbackComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    if (this.userService.email) {
      this.router.navigate([this.authService.getBackRoute()]);
      return;
    }
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token') || '';
		
    // redirect back
		const isRegistration = this.authService.getBackRoute() === '/registration';
    if (isRegistration) {
			this.saveToken(accessToken);
      this.router.navigate([this.authService.getBackRoute()]);
      return;
    }
    if (accessToken) {
      this.authService.clearUserCookie();
      fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.signIn(data.email, '', true);
        })
        .catch((error) => {
          alert('Something went wrong. Please try again later.');
          console.error('Error fetching user info:', error);
        });
    }
  }

  private signIn(email: string, password: string, socialLogin: boolean) {
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

  private processResult(result: Result) {
    if (result.error) {
      alert(result.error.msgUser);
      console.error(result.error.msgDev);
      this.router.navigate([this.authService.getBackRoute()]);
      return;
    }
    window.location.reload();
  }

  private saveToken(token: string) {
    const userCookie: UserCookie = {
      email: '',
      googleToken: token,
      facebookToken: '',
      roles: [],
    };
    this.authService.updateUserCookie(userCookie);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
