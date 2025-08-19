import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import { Screening, ScreeningStatus } from '../models/screening';
import { Ticket } from '../models/ticket';
import { RandomMovieGenerator } from './random-movie-generator';
import { v4 } from 'uuid';

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

  public async getAllMovies(): Promise<Movie[]> {
    const existingMovies = this.loadMoviesFromStorage();
    if (existingMovies.length > 0) {
      return existingMovies;
    }

    console.log('No movies in localStorage, fetching from API or generating...');

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
          id: movieData.id ? movieData.id.toString() : v4(),
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

      this.saveMoviesToStorage(movies);
      return movies;
    } catch (error) {
      console.error('Error fetching movies from API, using random movies as fallback:', error);
      
      const randomMovies = this.randomMovieGenerator.generateRandomMovies(25);
      
      this.saveMoviesToStorage(randomMovies);
      
      return randomMovies;
    }
  }

  public generateRandomScreenings(movies: Movie[], count: number): Screening[] {
    const existingScreenings = this.loadScreeningsFromStorage();
    if (existingScreenings.length > 0) {
      this.screenings = existingScreenings;
      return existingScreenings;
    }

    const screenings = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      const randomDate = new Date(now.getTime() + Math.random() * 10000000000);
      const randomSeatCount = Math.random() > 0.5 ? 100 : 150;
      const randomPrice = Math.floor(Math.random() * 1200) + 1000;
      
      const screening: Screening = new Screening(randomMovie.id, randomDate, randomSeatCount, randomPrice);
      screenings.push(screening);
    }
    
    this.screenings = screenings;
    this.saveScreeningsToStorage();
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
    this.screenings = this.generateRandomScreenings(movies, 100)
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

  public createTicket(screeningId: string, seatNumber: number, price: number): Ticket | null {
    if (this.isSeatTaken(screeningId, seatNumber)) {
      console.error('Seat is already taken!');
      return null;
    }

    const ticket: Ticket = {
      id: v4(),
      screeningId: screeningId,
      userId: this.activeSession() || '',
      seatNumber: seatNumber,
      purchaseDate: new Date(),
      price: price,
      status: ScreeningStatus.Reserved
    };

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.reservations.push(ticket);
      this.updateUserInStorage(currentUser);
    }

    this.addTicketToScreening(screeningId, ticket);

    return ticket;
  }

  public getUserTickets(): Ticket[] {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.reservations : [];
  }

  public updateTicketStatus(ticketId: string, status: ScreeningStatus): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const ticketIndex = currentUser.reservations.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return false;

    const ticket = currentUser.reservations[ticketIndex];
    const oldStatus = ticket.status;
    ticket.status = status;

    if (oldStatus === ScreeningStatus.Reserved && status === ScreeningStatus.Canceled) {
      this.removeTicketFromScreening(ticket.screeningId, ticketId);
    }

    this.updateUserInStorage(currentUser);
    return true;
  }

  public rateTicket(ticketId: string, rating: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || rating < 1 || rating > 5) return false;

    const ticketIndex = currentUser.reservations.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) return false;

    currentUser.reservations[ticketIndex].rating = rating;
    this.updateUserInStorage(currentUser);
    return true;
  }

  private updateUserInStorage(user: User): void {
    const storageStr = localStorage.getItem("kva-movies");
    if (!storageStr) return;

    const storage: { users: User[] } = JSON.parse(storageStr);
    const userIndex = storage.users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
      storage.users[userIndex] = user;
      localStorage.setItem("kva-movies", JSON.stringify(storage));
    }
  }

  public isSeatTaken(screeningId: string, seatNumber: number): boolean {
    const allUsers = this.getAllUsers();
    for (const user of allUsers) {
      for (const ticket of user.reservations) {
        if (ticket.screeningId === screeningId && 
            ticket.seatNumber === seatNumber && 
            ticket.status === ScreeningStatus.Reserved) {
          return true;
        }
      }
    }
    return false;
  }

  public addTicketToScreening(screeningId: string, ticket: Ticket): void {
    const screening = this.screenings.find(s => s.id === screeningId);
    if (screening) {
      screening.soldTickets.push(ticket);
      this.saveScreeningsToStorage();
    }
  }

  public removeTicketFromScreening(screeningId: string, ticketId: string): void {
    const screening = this.screenings.find(s => s.id === screeningId);
    if (screening) {
      screening.soldTickets = screening.soldTickets.filter(t => t.id !== ticketId);
      this.saveScreeningsToStorage();
    }
  }

  public getAllUsers(): User[] {
    const storageStr = localStorage.getItem("kva-movies");
    if (!storageStr) return [];

    const storage: { users: User[] } = JSON.parse(storageStr);
    return storage.users || [];
  }

  private saveScreeningsToStorage(): void {
    localStorage.setItem("kva-movies-screenings", JSON.stringify(this.screenings));
  }

  private loadScreeningsFromStorage(): Screening[] {
    const screeningsStr = localStorage.getItem("kva-movies-screenings");
    if (!screeningsStr) return [];

    try {
      const screeningsData = JSON.parse(screeningsStr);
      return screeningsData.map((data: any) => {
        const screening = new Screening(data.movieId, new Date(data.screeningDate), data.totalSeats, data.price);
        screening.id = data.id;
        screening.soldTickets = data.soldTickets || [];
        screening.ratings = data.ratings || [];
        return screening;
      });
    } catch (error) {
      console.error('Error loading screenings from storage:', error);
      return [];
    }
  }

  private saveMoviesToStorage(movies: Movie[]): void {
    try {
      localStorage.setItem("kva-movies-database", JSON.stringify(movies));
    } catch (error) {
      console.error('Error saving movies to storage:', error);
    }
  }

  private loadMoviesFromStorage(): Movie[] {
    const moviesStr = localStorage.getItem("kva-movies-database");
    if (!moviesStr) return [];

    try {
      const moviesData = JSON.parse(moviesStr);
      return moviesData.map((data: any) => ({
        ...data,
        releaseDate: new Date(data.releaseDate)
      }));
    } catch (error) {
      console.error('Error loading movies from storage:', error);
      return [];
    }
  }

  public clearMoviesDatabase(): void {
    localStorage.removeItem("kva-movies-database");
  }

  public clearAllData(): void {
    localStorage.removeItem("kva-movies-database");
    localStorage.removeItem("kva-movies-screenings");
    localStorage.removeItem("kva-movies");
    localStorage.removeItem("session");
  }

  public getStorageInfo(): any {
    const movies = this.loadMoviesFromStorage();
    const screenings = this.loadScreeningsFromStorage();
    const users = this.getAllUsers();
    
    return {
      movies: {
        count: movies.length,
        source: movies.length > 0 && movies[0].imageUrl?.includes('pinimg.com') ? 'Random Generated' : 'API',
        storageKey: 'kva-movies-database'
      },
      screenings: {
        count: screenings.length,
        storageKey: 'kva-movies-screenings'
      },
      users: {
        count: users.length,
        storageKey: 'kva-movies'
      },
      session: {
        active: this.isAuthenticated(),
        user: this.activeSession(),
        storageKey: 'session'
      }
    };
  }

  public async createSampleReservations(): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const hasOldReservations = currentUser.reservations.some(ticket => 
      ticket.screeningId.startsWith('sample-screening-')
    );

    if (hasOldReservations) {
      currentUser.reservations = [];
      this.updateUserInStorage(currentUser);
    }

    if (currentUser.reservations.length > 0) return;

    const movies = await this.getAllMovies();
    const screenings = this.generateRandomScreenings(movies, 50);
    
    if (screenings.length === 0) return;

    const sampleScreenings = [
      screenings[Math.floor(Math.random() * screenings.length)],
      screenings[Math.floor(Math.random() * screenings.length)],
      screenings[Math.floor(Math.random() * screenings.length)],
      screenings[Math.floor(Math.random() * screenings.length)],
      screenings[Math.floor(Math.random() * screenings.length)]
    ];

    const sampleTickets: Ticket[] = [
      {
        id: v4(),
        screeningId: sampleScreenings[0].id,
        userId: currentUser.email,
        seatNumber: 15,
        purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        price: sampleScreenings[0].price,
        status: ScreeningStatus.Watched,
        rating: 4
      },
      {
        id: v4(),
        screeningId: sampleScreenings[1].id,
        userId: currentUser.email,
        seatNumber: 12,
        purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        price: sampleScreenings[1].price,
        status: ScreeningStatus.Watched
      },
      {
        id: v4(),
        screeningId: sampleScreenings[2].id,
        userId: currentUser.email,
        seatNumber: 8,
        purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        price: sampleScreenings[2].price,
        status: ScreeningStatus.Reserved
      },
      {
        id: v4(),
        screeningId: sampleScreenings[3].id,
        userId: currentUser.email,
        seatNumber: 25,
        purchaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        price: sampleScreenings[3].price,
        status: ScreeningStatus.Reserved
      },
      {
        id: v4(),
        screeningId: sampleScreenings[4].id,
        userId: currentUser.email,
        seatNumber: 22,
        purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        price: sampleScreenings[4].price,
        status: ScreeningStatus.Canceled
      }
    ];

    currentUser.reservations = sampleTickets;
    this.updateUserInStorage(currentUser);

    sampleTickets.forEach(ticket => {
      this.addTicketToScreening(ticket.screeningId, ticket);
    });
  }
}

