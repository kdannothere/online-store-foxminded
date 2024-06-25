import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-task-3-online-store';
  constructor(private authService: AuthService) {}
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  isOwner(): boolean {
    return this.authService.isOwner();
  }
}
