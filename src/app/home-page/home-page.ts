import { Component } from '@angular/core';
import { MovieList } from '../movie-list/movie-list';
import { Diamonds } from '../diamonds/diamonds';

@Component({
  selector: 'HomePage',
  imports: [MovieList, Diamonds],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
