import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; 
import { MatButton } from '@angular/material/button'

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
  @Input() movie: any;
}
