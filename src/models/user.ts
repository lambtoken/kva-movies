import { Ticket } from './ticket';

export interface User {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  reservations: Ticket[];
  favoriteGenres: string[];
}