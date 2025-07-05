import { Movie } from './movie';
import { Ticket } from './ticket';

import { v4 } from 'uuid';

export enum ScreeningStatus {
  Reserved,
  Watched,
  Canceled
}

export class Screening {
  id: string;
  movieId: string;
  soldTickets: Ticket[];
  screeningDate: Date;
  price: number;
  ratings: number[];

  totalSeats: number;

  constructor(movieId: string, date: Date, totalSeats: number, price: number) {
    this.id = v4();
    this.movieId = movieId;
    this.soldTickets = [];
    this.screeningDate = date;
    this.price = price;
    this.ratings = [];
    this.totalSeats = totalSeats;
  }

  public calculateAvailableSeats(): number {
    return this.totalSeats - this.soldTickets.length;
  }
}
