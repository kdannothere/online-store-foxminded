import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userRole: Set<string> = new Set();
  constructor() {
    // this.userRole.add(UserRole.Customer);
  }
  isAuthenticated(): boolean {
    if (this.isAdmin() || this.isOwner() || this.isCustomer()) return true;
    return false;
  }
  isAdmin(): boolean {
    return this.userRole.has(UserRole.Admin);
  }
  isOwner(): boolean {
    return this.userRole.has(UserRole.Owner);
  }
  isCustomer(): boolean {
    return this.userRole.has(UserRole.Customer);
  }
}
