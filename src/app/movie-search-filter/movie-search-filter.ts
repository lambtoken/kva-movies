import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { Movie } from '../../models/movie';
import { Screening } from '../../models/screening';
import { PseudoServer } from '../pseudo-server';

export interface MovieFilters {
  searchText: string;
  selectedGenres: string[];
  director: string;
  actor: string;
  releaseDateStart: Date | null;
  releaseDateEnd: Date | null;
  screeningDateStart: Date | null;
  screeningDateEnd: Date | null;
  priceMin: number;
  priceMax: number;
  ratingMin: number;
  duration: string;
}

@Component({
  selector: 'app-movie-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule
  ],
  templateUrl: './movie-search-filter.html',
  styleUrl: './movie-search-filter.css'
})
export class MovieSearchFilter implements OnInit {
  @Output() filtersChanged = new EventEmitter<MovieFilters>();

  filters: MovieFilters = {
    searchText: '',
    selectedGenres: [],
    director: '',
    actor: '',
    releaseDateStart: null,
    releaseDateEnd: null,
    screeningDateStart: null,
    screeningDateEnd: null,
    priceMin: 500,
    priceMax: 2000,
    ratingMin: 0,
    duration: ''
  };

  availableGenres: string[] = [];
  availableDirectors: string[] = [];
  availableActors: string[] = [];
  priceRange = { min: 500, max: 2000 };
  ratingRange = { min: 0, max: 5 };

  isExpanded = false;

  constructor(private pseudoServer: PseudoServer) {}

  async ngOnInit() {
    await this.loadFilterOptions();
    this.emitFilters();
  }

  async loadFilterOptions() {
    try {
      const movies = await this.pseudoServer.getAllMovies();
      const screenings = this.pseudoServer.getAllScreenings();

      const genresSet = new Set<string>();
      movies.forEach(movie => {
        movie.genres.forEach(genre => genresSet.add(genre));
      });
      this.availableGenres = Array.from(genresSet).sort();

      const directorsSet = new Set<string>();
      movies.forEach(movie => directorsSet.add(movie.director));
      this.availableDirectors = Array.from(directorsSet).sort();

      const actorsSet = new Set<string>();
      movies.forEach(movie => {
        movie.actors.forEach(actor => actorsSet.add(actor));
      });
      this.availableActors = Array.from(actorsSet).sort();

      if (screenings.length > 0) {
        const prices = screenings.map(s => s.price);
        this.priceRange.min = Math.min(...prices);
        this.priceRange.max = Math.max(...prices);
        this.filters.priceMin = this.priceRange.min;
        this.filters.priceMax = this.priceRange.max;
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }

  onSearchTextChange() {
    this.emitFilters();
  }

  onGenreSelectionChange() {
    this.emitFilters();
  }

  onDirectorChange() {
    this.emitFilters();
  }

  onActorChange() {
    this.emitFilters();
  }

  onDateChange() {
    this.emitFilters();
  }

  onPriceChange() {
    this.emitFilters();
  }

  onRatingChange() {
    this.emitFilters();
  }

  onDurationChange() {
    this.emitFilters();
  }

  clearFilters() {
    this.filters = {
      searchText: '',
      selectedGenres: [],
      director: '',
      actor: '',
      releaseDateStart: null,
      releaseDateEnd: null,
      screeningDateStart: null,
      screeningDateEnd: null,
      priceMin: this.priceRange.min,
      priceMax: this.priceRange.max,
      ratingMin: 0,
      duration: ''
    };
    this.emitFilters();
  }

  removeGenre(genre: string) {
    this.filters.selectedGenres = this.filters.selectedGenres.filter(g => g !== genre);
    this.emitFilters();
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  private emitFilters() {
    this.filtersChanged.emit({ ...this.filters });
  }

  formatPrice(value: number): string {
    return `${value} RSD`;
  }

  formatRating(value: number): string {
    return value === 0 ? 'Bilo koja' : `${value}+ zvezdice`;
  }
} 