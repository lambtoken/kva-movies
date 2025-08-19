import { Component } from '@angular/core';
import { MovieList } from '../movie-list/movie-list';
import { MovieSearchFilter, MovieFilters } from '../movie-search-filter/movie-search-filter';

@Component({
  selector: 'HomePage',
  imports: [MovieList, MovieSearchFilter],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  currentFilters: MovieFilters | null = null;

  onFiltersChanged(filters: MovieFilters) {
    this.currentFilters = filters;
  }
}
