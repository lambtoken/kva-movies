import { Component } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'MovieList',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css'
})
export class MovieList {
  movies = [
    { id: 1, title: 'Inception', year: 2010 },
    { id: 2, title: 'Interstellar', year: 2014 },
    { id: 3, title: 'The Dark Knight', year: 2008 }
  ];

  constructor() {
    // You can fetch movies from a service or API here
  }
}
