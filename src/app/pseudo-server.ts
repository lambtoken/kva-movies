import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Movie } from '../models/movie';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PseudoServer {

  private baseUrl: string = 'https://movie.pequla.com/api'

  constructor() { }

  public registerUser(username: string, password: string): Boolean {
    if (localStorage.getItem(username)) {
      return false;
    }

    const user: User = {
      username,
      password,
      movies: []
    }

    localStorage.setItem(username, JSON.stringify(user));
    return true;
}

  public loginUser(username: string, password: string): Boolean {
    const user = this.getUser(username);
    if (!user) {
      return false;
    }

    if (user.password === password) {
      return true;
    } else {
      return false;
    }
  }

  public getUser(username: string): User | null {
    const user = localStorage.getItem(username);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public async getAllMovies() {
    try {
      const response = await axios.get(`${this.baseUrl}/movie`);
      return response.data as Movie[];
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  }
}
