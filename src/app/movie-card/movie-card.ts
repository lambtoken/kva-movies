import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; 
import { MatButton } from '@angular/material/button'
import { Movie } from '../../models/movie';

@Component({
  selector: 'MovieCard',
  imports: [
    MatCardModule,
    MatButton
  ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {
  @Input() movie!: Movie;
}
