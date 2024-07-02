import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { DynamicComponentService } from './services/dynamic-component.service';
import { SignInComponent } from './components/auth/sign-in/sign-in.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SignInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dynamicComponentService: DynamicComponentService,
    private router: Router
  ) {}

  title = 'angular-task-3-online-store';
  @ViewChild('modalTemplate', { read: ViewContainerRef })
  modalContainer!: ViewContainerRef;

  showSignIn() {
    this.dynamicComponentService.createComponent(
      this.modalContainer,
      SignInComponent
    );
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isOwner(): boolean {
    return this.authService.isOwner();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logOut();
    window.location.reload();
  }

  closeModals() {
    this.dynamicComponentService.removeComponents(SignInComponent);
  }

  goTo(route: string) {
    this.closeModals();
    this.router.navigate([route]);
  }

  get userEmail(): string {
    return this.userService.email;
  }
}
