import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { PseudoServer } from '../pseudo-server';
import { Movie } from '../../models/movie';
import { Screening, ScreeningStatus } from '../../models/screening';
import { MovieFilters } from '../movie-search-filter/movie-search-filter';

@Component({
  selector: 'MovieList',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css']
})
export class MovieList implements OnInit, OnChanges {
  @Input() filters: MovieFilters | null = null;

  public allMovies: Movie[] = [];
  public filteredMovies: Movie[] = [];
  public screenings: Screening[] = [];
  public isUsingFallbackData = false;

  constructor(private server: PseudoServer) {}

  async ngOnInit() {
    try {
      this.allMovies = await this.server.getAllMovies();
      this.screenings = this.server.generateRandomScreenings(this.allMovies, 50);
      
      if (this.allMovies.length > 0 && this.allMovies[0].imageUrl.includes('pinimg.com')) {
        this.isUsingFallbackData = true;
      }
      
      this.applyFilters();
    } catch (error) {
      console.error('Greska prilikom ucitavanja filmova', error);
      this.allMovies = [];
      this.filteredMovies = [];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.applyFilters();
    }
  }

  private applyFilters() {
    if (!this.filters || this.allMovies.length === 0) {
      this.filteredMovies = [...this.allMovies];
      return;
    }

    this.filteredMovies = this.allMovies.filter(movie => {
      if (this.filters!.searchText) {
        const searchText = this.filters!.searchText.toLowerCase();
        const movieText = [
          movie.title,
          movie.description,
          movie.director,
          ...movie.genres,
          ...movie.actors
        ].join(' ').toLowerCase();
        
        if (!movieText.includes(searchText)) {
          return false;
        }
      }

      if (this.filters!.selectedGenres.length > 0) {
        const hasMatchingGenre = this.filters!.selectedGenres.some(genre => 
          movie.genres.includes(genre)
        );
        if (!hasMatchingGenre) {
          return false;
        }
      }

      if (this.filters!.director && movie.director !== this.filters!.director) {
        return false;
      }

      if (this.filters!.actor && !movie.actors.includes(this.filters!.actor)) {
        return false;
      }

      if (this.filters!.releaseDateStart || this.filters!.releaseDateEnd) {
        const releaseDate = new Date(movie.releaseDate);
        if (this.filters!.releaseDateStart && releaseDate < this.filters!.releaseDateStart) {
          return false;
        }
        if (this.filters!.releaseDateEnd && releaseDate > this.filters!.releaseDateEnd) {
          return false;
        }
      }

      if (this.filters!.screeningDateStart || this.filters!.screeningDateEnd) {
        const movieScreenings = this.screenings.filter(s => s.movieId === movie.id);
        const hasValidScreening = movieScreenings.some(screening => {
          const screeningDate = new Date(screening.screeningDate);
          if (this.filters!.screeningDateStart && screeningDate < this.filters!.screeningDateStart) {
            return false;
          }
          if (this.filters!.screeningDateEnd && screeningDate > this.filters!.screeningDateEnd) {
            return false;
          }
          return true;
        });
        if (!hasValidScreening) {
          return false;
        }
      }

      const movieScreenings = this.screenings.filter(s => s.movieId === movie.id);
      if (movieScreenings.length > 0) {
        const hasValidPrice = movieScreenings.some(screening => 
          screening.price >= this.filters!.priceMin && screening.price <= this.filters!.priceMax
        );
        if (!hasValidPrice) {
          return false;
        }
      }

      if (this.filters!.ratingMin > 0) {
        const averageRating = this.getMovieAverageRating(movie.id);
        if (averageRating < this.filters!.ratingMin) {
          return false;
        }
      }

      return true;
    });
  }

  private getMovieAverageRating(movieId: string): number {
    const allUsers = this.server.getAllUsers ? this.server.getAllUsers() : [];
    const ratings: number[] = [];
    
    allUsers.forEach(user => {
      user.reservations.forEach(ticket => {
        if (ticket.rating && ticket.status === ScreeningStatus.Watched) {
          const screening = this.screenings.find(s => s.id === ticket.screeningId);
          if (screening && screening.movieId === movieId) {
            ratings.push(ticket.rating);
          }
        }
      });
    });

    return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }

  get movies(): Movie[] {
    return this.filteredMovies;
  }
}
