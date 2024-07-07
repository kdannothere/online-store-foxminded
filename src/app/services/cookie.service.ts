import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor() {}

  saveCookie(key: string, value: string): void {
    document.cookie = `${key}=${encodeURIComponent(value)}`;
  }

  getCookie(key: string): string {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.trim().split('=');
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return '';
  }
}

