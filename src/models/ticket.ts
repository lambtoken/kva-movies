import { Screening, ScreeningStatus } from './screening';

export interface Ticket {
    id: string;
    screeningId: string;
    userId: string;
    seatNumber: number;
    purchaseDate: Date;
    price: number;
    status: ScreeningStatus;
    rating?: number;
}