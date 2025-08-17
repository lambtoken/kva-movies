import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarLink } from '../navbar-link/navbar-link';
import { PseudoServer } from '../pseudo-server';
import { User } from '../../models/user';

@Component({
  selector: 'Navbar',
  imports: [RouterModule, NavbarLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  currentUser: User | null = null;

  constructor(private server: PseudoServer) {
    this.checkAuthStatus();
    
    window.addEventListener('storage', () => {
      this.checkAuthStatus();
    });
    
    window.addEventListener('focus', () => {
      this.checkAuthStatus();
    });
  }

  private checkAuthStatus(): void {
    this.currentUser = this.server.getCurrentUser();
  }

  logout(): void {
    this.server.logout();
    this.currentUser = null;
    window.location.href = '/landing';
  }

  isAuthenticated(): boolean {
    return this.server.isAuthenticated();
  }
}
