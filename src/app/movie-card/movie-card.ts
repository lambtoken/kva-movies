import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card'; 

@Component({
  selector: 'MovieCard',
  imports: [
    MatCardModule
  ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {
  @Input() movie: any;
}
