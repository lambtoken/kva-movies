import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PseudoServer } from '../pseudo-server';
import { User } from '../../models/user';
import { Ticket } from '../../models/ticket';
import { Movie } from '../../models/movie';
import { Screening, ScreeningStatus } from '../../models/screening';

interface ReservationWithDetails {
  ticket: Ticket;
  movie?: Movie;
  screening?: Screening;
}

@Component({
  selector: 'app-reservations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations-page.html',
  styleUrl: './reservations-page.css'
})
export class ReservationsPage implements OnInit {
  user: User | null = null;
  reservations: ReservationWithDetails[] = [];
  movies: Movie[] = [];
  screenings: Screening[] = [];
  loading = true;
  message = '';
  
  tempRatings: { [ticketId: string]: number } = {};
  hoverRatings: { [ticketId: string]: number } = {};

  constructor(private pseudoServer: PseudoServer) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      this.user = this.pseudoServer.getCurrentUser();
      if (!this.user) {
        this.message = 'No user data found. Please log in.';
        return;
      }

      if (this.user.reservations.length === 0) {
        await this.pseudoServer.createSampleReservations();
        this.user = this.pseudoServer.getCurrentUser(); // Refresh user data
      }

      this.movies = await this.pseudoServer.getAllMovies();
      this.screenings = this.pseudoServer.generateRandomScreenings(this.movies, 20);

      this.reservations = this.user!.reservations.map(ticket => {
        const screening = this.screenings.find(s => s.id === ticket.screeningId);
        const movie = screening ? this.movies.find(m => m.id === screening.movieId) : undefined;
        
        return {
          ticket,
          movie,
          screening
        };
      });

      this.reservations.sort((a, b) => 
        new Date(b.ticket.purchaseDate).getTime() - new Date(a.ticket.purchaseDate).getTime()
      );

    } catch (error) {
      console.error('Error loading reservations:', error);
      this.message = 'Error loading reservations. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  getStatusText(status: ScreeningStatus): string {
    switch (status) {
      case ScreeningStatus.Reserved:
        return 'Reserved';
      case ScreeningStatus.Watched:
        return 'Watched';
      case ScreeningStatus.Canceled:
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: ScreeningStatus): string {
    switch (status) {
      case ScreeningStatus.Reserved:
        return 'status-reserved';
      case ScreeningStatus.Watched:
        return 'status-watched';
      case ScreeningStatus.Canceled:
        return 'status-canceled';
      default:
        return 'status-unknown';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getScreeningDateText(reservation: ReservationWithDetails): string {
    if (reservation.screening?.screeningDate) {
      return this.formatDate(reservation.screening.screeningDate);
    }
    return 'Unknown';
  }

  formatPurchaseDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  canRate(reservation: ReservationWithDetails): boolean {
    return reservation.ticket.status === ScreeningStatus.Watched && 
           !reservation.ticket.rating;
  }

  isWatched(status: ScreeningStatus): boolean {
    return status === ScreeningStatus.Watched;
  }

  isReserved(status: ScreeningStatus): boolean {
    return status === ScreeningStatus.Reserved;
  }

  isCanceled(status: ScreeningStatus): boolean {
    return status === ScreeningStatus.Canceled;
  }

  getActiveReservations(): ReservationWithDetails[] {
    return this.getFilteredReservations(ScreeningStatus.Reserved);
  }

  getWatchedReservations(): ReservationWithDetails[] {
    return this.getFilteredReservations(ScreeningStatus.Watched);
  }

  getCanceledReservations(): ReservationWithDetails[] {
    return this.getFilteredReservations(ScreeningStatus.Canceled);
  }

  rateMovie(reservation: ReservationWithDetails, rating: number) {
    if (!this.user || !reservation.movie) return;

    reservation.ticket.rating = rating;

    const ticketIndex = this.user.reservations.findIndex(t => t.id === reservation.ticket.id);
    if (ticketIndex !== -1) {
      this.user.reservations[ticketIndex] = reservation.ticket;
    }

    this.updateUserInStorage();

    delete this.tempRatings[reservation.ticket.id];
    delete this.hoverRatings[reservation.ticket.id];

    this.showMessage('Rating submitted successfully!', 'success');
  }

  changeReservationStatus(reservation: ReservationWithDetails, newStatus: ScreeningStatus) {
    if (!this.user) return;

    const oldStatus = reservation.ticket.status;
    
    reservation.ticket.status = newStatus;

    if (oldStatus === ScreeningStatus.Reserved && newStatus === ScreeningStatus.Watched) {
      reservation.ticket.rating = undefined;
    }

    const ticketIndex = this.user.reservations.findIndex(t => t.id === reservation.ticket.id);
    if (ticketIndex !== -1) {
      this.user.reservations[ticketIndex] = reservation.ticket;
    }

    this.updateUserInStorage();

    const statusText = this.getStatusText(newStatus);
    this.showMessage(`Reservation status changed to ${statusText}!`, 'success');
  }

  cancelReservation(reservation: ReservationWithDetails) {
    this.changeReservationStatus(reservation, ScreeningStatus.Canceled);
  }

  markAsWatched(reservation: ReservationWithDetails) {
    this.changeReservationStatus(reservation, ScreeningStatus.Watched);
  }

  onRatingHover(ticketId: string, rating: number) {
    this.hoverRatings[ticketId] = rating;
  }

  onRatingLeave(ticketId: string) {
    delete this.hoverRatings[ticketId];
  }

  getEffectiveRating(reservation: ReservationWithDetails): number {
    const ticketId = reservation.ticket.id;
    return this.hoverRatings[ticketId] || 
           this.tempRatings[ticketId] || 
           reservation.ticket.rating || 
           0;
  }

  isStarFilled(reservation: ReservationWithDetails, starIndex: number): boolean {
    const effectiveRating = this.getEffectiveRating(reservation);
    return starIndex <= effectiveRating;
  }

  private showMessage(text: string, type: 'success' | 'error' = 'success') {
    this.message = text;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  enableReRating(reservation: ReservationWithDetails) {
    if (!this.user) return;

    reservation.ticket.rating = undefined;

    const ticketIndex = this.user.reservations.findIndex(t => t.id === reservation.ticket.id);
    if (ticketIndex !== -1) {
      this.user.reservations[ticketIndex] = reservation.ticket;
    }

    this.updateUserInStorage();

    this.showMessage('You can now rate this movie again!', 'success');
  }

  private updateUserInStorage() {
    const storageStr = localStorage.getItem("kva-movies");
    if (!storageStr || !this.user) return;

    const storage: { users: User[] } = JSON.parse(storageStr);
    const userIndex = storage.users.findIndex(u => u.email === this.user?.email);
    
    if (userIndex !== -1) {
      storage.users[userIndex] = this.user;
      localStorage.setItem("kva-movies", JSON.stringify(storage));
    }
  }

  getFilteredReservations(status?: ScreeningStatus): ReservationWithDetails[] {
    if (!status) return this.reservations;
    return this.reservations.filter(r => r.ticket.status === status);
  }
} 