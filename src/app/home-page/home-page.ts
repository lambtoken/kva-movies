import { Component } from '@angular/core';
import { MovieList } from '../movie-list/movie-list';

@Component({
  selector: 'HomePage',
  imports: [MovieList],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
