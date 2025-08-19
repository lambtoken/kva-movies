import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Diamonds } from './diamonds/diamonds';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Diamonds],
  templateUrl: './app.html',
  styles: [`
    .router-container {
      position: relative;
      height: 100%;
      width: 1200px;
      margin: 0 auto;
    }
    router-outlet {
      display: block;
    }
  `]
})
export class App {}