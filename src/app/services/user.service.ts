import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private cookieService: CookieService) {}

  private cookieKey = 'user';

  private get data(): any {
    const value = this.cookieService.getCookie(this.cookieKey);
    if (value) return JSON.parse(value);
    return {};
  }

  get email(): string {
    return this.data.email || '';
  }

  get roles(): string[] {
    return this.data.roles || [];
  }

  get googleToken(): string {
    return this.data.googleToken || '';
  }

  get facebookToken(): string {
    return this.data.facebookToken || '';
  }
}
