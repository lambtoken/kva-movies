import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarLink } from '../navbar-link/navbar-link';

@Component({
  selector: 'Navbar',
  imports: [RouterModule, NavbarLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {}
