import { Screening } from './screening';
import { TicketSerializer } from './ticketSerializer';

export class ScreeningSerializer {
  static serialize(screening: Screening): any {
    return {
      id: screening.id,
      movieId: screening.movieId,
      screeningDate: screening.screeningDate.toISOString(),
      price: screening.price,
      ratings: screening.ratings,
      totalSeats: screening.totalSeats,
      soldTickets: screening.soldTickets.map(ticket => TicketSerializer.serialize(ticket))
    };
  }

  static deserialize(data: any): Screening {
    const screening = new Screening(
      data.movieId,
      new Date(data.screeningDate),
      data.totalSeats,
      data.price
    );

    screening.id = data.id;
    screening.ratings = data.ratings;
    screening.soldTickets = data.soldTickets.map((t: any) => TicketSerializer.deserialize(t));

    return screening;
  }
}