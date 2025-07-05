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

  constructor(private server: PseudoServer) {}

  async ngOnInit() {
    this.movies = await this.server.getAllMovies();
  }
}
