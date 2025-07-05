import { User } from './user';
import { TicketSerializer } from './ticketSerializer';

export class UserSerializer {
  static serialize(user: User): any {
    return {
      ...user,
      reservations: user.reservations.map(t => TicketSerializer.serialize(t)),
    };
  }

  static deserialize(data: any): User {
    return {
      ...data,
      reservations: data.reservations.map((t: any) => TicketSerializer.deserialize(t)),
    };
  }
}