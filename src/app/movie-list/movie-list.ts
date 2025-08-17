import { Component, OnInit } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { PseudoServer } from '../pseudo-server';
import { Movie } from '../../models/movie';

@Component({
  selector: 'MovieList',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieList implements OnInit {

  public movies: Movie[] = [];
  public isUsingFallbackData = false;

  constructor(private server: PseudoServer) {}

  async ngOnInit() {
    try {
      this.movies = await this.server.getAllMovies();
      if (this.movies.length > 0 && this.movies[0].imageUrl.includes('pinimg.com')) {
        this.isUsingFallbackData = true;
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      this.movies = [];
    }
  }

}
