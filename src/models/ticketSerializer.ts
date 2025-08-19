import { Ticket } from './ticket';

export class TicketSerializer {
  static serialize(ticket: Ticket): any {
    return {
      ...ticket,
      purchaseDate: ticket.purchaseDate.toISOString(),
    };
  }

  static deserialize(data: any): Ticket {
    return {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
      rating: data.rating ? Number(data.rating) : undefined,
    };
  }
}
