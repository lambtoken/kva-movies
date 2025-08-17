import { Injectable } from '@angular/core';
import { Movie, Genre } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class RandomMovieGenerator {

  private movieTitles = [
    'The Quantum Paradox', 'Midnight Echoes', 'Stellar Dreams', 'Neon Nights', 'The Last Frontier',
    'Whispers in the Dark', 'Beyond the Horizon', 'The Silent Storm', 'Eternal Flame', 'Shadow Walker',
    'The Lost Kingdom', 'Rising Phoenix', 'The Hidden Truth', 'Ocean\'s Heart', 'Mountain\'s Call',
    'The Forgotten City', 'Time Traveler', 'The Secret Garden', 'Night Rider', 'The Golden Path',
    'The Broken Mirror', 'The Last Dance', 'The Hidden Valley', 'The Silent River', 'The Lost Star',
    'The Ancient Scroll', 'The Mystic Forest', 'The Crystal Cave', 'The Desert Rose', 'The Winter\'s Tale'
  ];

  private movieDescriptions = [
    'A thrilling adventure that takes you to the edge of reality and beyond.',
    'An epic journey through time and space that will change everything you thought you knew.',
    'A mysterious tale of love, betrayal, and redemption in a world unlike any other.',
    'When the past meets the future, only one person can save the present.',
    'In a world where magic is real, one hero must find the courage to face their destiny.',
    'A story of friendship, courage, and the power of believing in yourself.',
    'An action-packed thriller that will keep you on the edge of your seat.',
    'A heartwarming tale of family, love, and the bonds that hold us together.',
    'A sci-fi adventure that explores the boundaries of human imagination.',
    'A romantic comedy that proves love can be found in the most unexpected places.',
    'A horror story that will make you question what\'s real and what\'s just your imagination.',
    'A dramatic masterpiece that tells the story of human resilience and hope.',
    'An adventure that takes you to the farthest reaches of the known universe.',
    'A mystery that will keep you guessing until the very end.',
    'A tale of survival against all odds in the harshest of environments.'
  ];

  private directors = [
    'Christopher Nolan', 'Quentin Tarantino', 'Steven Spielberg', 'James Cameron', 'Peter Jackson',
    'Ridley Scott', 'Martin Scorsese', 'Alfred Hitchcock', 'Stanley Kubrick', 'Francis Ford Coppola',
    'George Lucas', 'Tim Burton', 'Wes Anderson', 'David Fincher', 'Denis Villeneuve',
    'Damien Chazelle', 'Greta Gerwig', 'Jordan Peele', 'Bong Joon-ho', 'Alfonso Cuarón',
    'Guillermo del Toro', 'Darren Aronofsky', 'Paul Thomas Anderson', 'Coen Brothers', 'Wachowski Sisters'
  ];

  private actors = [
    'Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Scarlett Johansson', 'Brad Pitt',
    'Angelina Jolie', 'Johnny Depp', 'Emma Stone', 'Ryan Gosling', 'Jennifer Lawrence',
    'Denzel Washington', 'Sandra Bullock', 'Will Smith', 'Charlize Theron', 'Matt Damon',
    'Julia Roberts', 'George Clooney', 'Nicole Kidman', 'Hugh Jackman', 'Anne Hathaway',
    'Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo', 'Jeremy Renner',
    'Scarlett Johansson', 'Elizabeth Olsen', 'Benedict Cumberbatch', 'Tom Holland', 'Zendaya'
  ];

  private genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure',
    'Fantasy', 'Mystery', 'Crime', 'Animation', 'Documentary', 'War', 'Western', 'Musical'
  ];

  private coverImageUrl = 'https://i.pinimg.com/736x/da/2c/d3/da2cd3ad3c311d1db8d42819c9f49b04.jpg';

  constructor() { }

  public generateRandomMovies(count: number = 20): Movie[] {
    const movies: Movie[] = [];
    
    for (let i = 0; i < count; i++) {
      movies.push(this.generateRandomMovie(i.toString()));
    }
    
    return movies;
  }

  private generateRandomMovie(id: string): Movie {
    const randomTitle = this.getRandomElement(this.movieTitles);
    const randomDescription = this.getRandomElement(this.movieDescriptions);
    const randomDirector = this.getRandomElement(this.directors);
    
    const genreCount = Math.floor(Math.random() * 3) + 1;
    const randomGenres = this.getRandomElements(this.genres, genreCount);
    
    const actorCount = Math.floor(Math.random() * 3) + 2;
    const randomActors = this.getRandomElements(this.actors, actorCount);
    
    const randomDate = this.generateRandomDate();
    
    return {
      id: id,
      title: randomTitle,
      description: randomDescription,
      releaseDate: randomDate,
      genres: randomGenres,
      director: randomDirector,
      actors: randomActors,
      imageUrl: this.coverImageUrl
    };
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateRandomDate(): Date {
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, 0, 1);
    const timeDiff = now.getTime() - fiveYearsAgo.getTime();
    const randomTime = fiveYearsAgo.getTime() + Math.random() * timeDiff;
    return new Date(randomTime);
  }
} 