import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { Screening, ScreeningStatus } from '../models/screening';
import { RandomMovieGenerator } from './random-movie-generator';

import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class PseudoServer {

  private baseUrl: string = 'https://movie.pequla.com/api'
  private screenings: Screening[] = [];

  constructor(private randomMovieGenerator: RandomMovieGenerator) { }

  public registerUser(
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string,
    phone: string,
    address: string
  ): Boolean {
    if (!localStorage.getItem("kva-movies")) {
      localStorage.setItem("kva-movies", JSON.stringify({users: []}))
    }

    let storageStr = localStorage.getItem("kva-movies");
    
    if (!storageStr) {
      console.error("Obtaining storage failed!")
      return false
    }

    let storage: { users: User[] } = JSON.parse(storageStr);

    if (storage.users.find((u: User) => u.email === email)) {
      console.warn("User with that email already exists")
      return false
    }

    const newUser: User = {
      firstName: firstName,
      lastName: lastName,
      password: password,
      email: email,
      phone: phone,
      address: address,
      reservations: [],
      favoriteGenres: []
    }

    storage.users.push(newUser);

    localStorage.setItem("kva-movies", JSON.stringify(storage));
    
    console.log('Auto-login after registration for:', email); // Debug log
    this.loginUser(email, password);
    return true;
}

  public loginUser(username: string, password: string): Boolean {
    const user = this.getUser(username);
    if (!user) {
      return false;
    }

    if (user.password === password) {
      localStorage.setItem("session", username)
      return true;
    } else {
      return false;
    }
  }

  public getUser(email: string): User | null {
    let storageStr = localStorage.getItem("kva-movies");

    if (!storageStr) {
      return null
    }

    let storage: { users: User[] } = JSON.parse(storageStr);

    const filter = storage.users.find((u: User) => u.email === email)

    return filter || null
  }

  public async getAllMovies() {
    try {
      const response = await axios.get(`${this.baseUrl}/movie`);
      const movies = [] as Movie[]
      
      for (let i = 1; i < response.data.length; i++) {
        const movieData = response.data[i]

        let genres = []

        for (let i = 1; i < movieData.movieGenres.length; i++) {
          genres.push(movieData.movieGenres[i].genre.name)
        }

        if (genres.length == 0) {
          genres.push("Nepoznat")
        }

        let actors = []

        for (let i = 1; i < movieData.movieActors.length; i++) {
          actors.push(movieData.movieActors[i].actor.name)
        }

        if (actors.length == 0) {
          actors.push("Nema podataka")
        }

        const movie: Movie = {
          id: "123",
          title: movieData.title,
          description: movieData.description,
          releaseDate: movieData.startDate,
          genres: genres,
          director: movieData.director.name,
          actors: actors,
          imageUrl: movieData.poster,
        }

        movies.push(movie)
      }

      return movies
    } catch (error) {
      console.error('Error fetching movies from API, using random movies as fallback:', error);
      return this.randomMovieGenerator.generateRandomMovies(25);
    }
  }

  public generateRandomScreenings(movies: Movie[], count: number) :Screening[] {
    const screenings = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const randomDate = new Date(now.getTime() + Math.random() * 10000000000);
      const randomSeatCount = Math.random() > 0 && 100 || 150
      const randomPrice = Math.floor(Math.random() * 1200) + 1000
      
      const screening: Screening = new Screening(randomMovie.id, randomDate, randomSeatCount, randomPrice)

      screenings.push(screening);

    }
    return screenings;
  }

  public getScreeningsByMovie(movies: Movie[], screenings: Screening[]) {
    return movies.map(movie => ({
      movie,
      screenings: screenings.filter(s => s.movieId === movie.id)
    }));
  }

  public async setup() {
    const movies = await this.getAllMovies();   
    this.screenings = this.generateRandomScreenings(movies, 10)
  }

  public generateRandomMoviesForTesting(count: number = 25): Movie[] {
    return this.randomMovieGenerator.generateRandomMovies(count);
  }

  public activeSession(): string | null {
    const session = localStorage.getItem("session")
    
    if (!session) return null
    
    return session
  }

  public getCurrentUser(): User | null {
    const sessionEmail = this.activeSession();
    if (!sessionEmail) return null;
    
    return this.getUser(sessionEmail);
  }

  public isAuthenticated(): boolean {
    return this.activeSession() !== null;
  }

  public logout(): void {
    localStorage.removeItem("session");
  }
}
