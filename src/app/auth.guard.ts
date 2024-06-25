import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const byAuthUser = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const byOwnerOrAdmin = () => {
  const authService = inject(AuthService);
  if (authService.isOwner() || authService.isAdmin()) {
    return true;
  } else {
    alert('Access denied ¯\_(ツ)_/¯')
    return false;
  }
};

export const byAdmin = () => {
  const authService = inject(AuthService);
  if (authService.isAdmin()) {
    return true;
  } else {
    alert('Access denied ¯\_(ツ)_/¯')
    return false;
  }
};
