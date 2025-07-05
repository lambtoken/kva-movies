import { Ticket } from './ticket';
import { Genre } from './movie';

export interface User {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  reservations: Ticket[];
  favoriteGenres: Genre[];
}