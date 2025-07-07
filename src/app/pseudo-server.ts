import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { Screening, ScreeningStatus } from '../models/screening';

import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class PseudoServer {

  private baseUrl: string = 'https://movie.pequla.com/api'
  private screenings: Screening[] = [];

  constructor() { }

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
      console.warn("User with that name exists")
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
      console.error('Error fetching movies:', error);
      return [];
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

  public activeSession(): string | null {
    const session = localStorage.getItem("session")
    
    if (!session) return null
    
    return session
  }
}
