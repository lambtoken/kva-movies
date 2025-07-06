import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  trigger, 
  transition, 
  style, 
  animate, 
  query, 
  group,
  sequence
} from '@angular/animations';
import { Navbar } from './navbar/navbar';
import { PseudoServer } from './pseudo-server';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './app.html',
  styles: [`
    .router-container {
      position: relative;
      height: 100%;
      width: 1000px;
      margin: 0 auto;
    }
    router-outlet {
      display: contents;
    }
  `],
  animations: [
    trigger('fadeAnimation', [
      transition('* => *', [
        group([
          // Exit animation
          query(':leave', [
          style({ opacity: 0 }),            
          animate('1000ms ease-in-out', style({ opacity: 0 }))
          ], { optional: true }),
          
          // Enter animation with delay
          query(':enter', [
            style({ opacity: 0 }),
            animate('1000ms 300ms ease-in-out', style({ opacity: 1 }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})


export class App {
  constructor() {
    // let server = new PseudoServer();
    // server.getAllMovies().then(movies => console.log('Movies fetched:', movies));
    // You can initialize any services or data here if needed
  }
  getOutletState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}