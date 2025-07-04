import { Movie } from './movie';

export type User = {
  username: string;
  password: string;
  email?: string;
  movies: Movie[];
}