import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 
import { MatButton } from '@angular/material/button'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { TicketPurchaseDialog, TicketPurchaseData, TicketPurchaseResult } from '../ticket-purchase-dialog/ticket-purchase-dialog';
import { NotificationDialog, NotificationData } from '../notification-dialog/notification-dialog';
import { PseudoServer } from '../pseudo-server';
import { ScreeningStatus } from '../../models/screening';

@Component({
  selector: 'MovieCard',
  imports: [
    CommonModule,
    MatCardModule,
    MatButton
  ],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {
  @Input() movie!: Movie;

  constructor(
    private dialog: MatDialog,
    private pseudoServer: PseudoServer,
    private router: Router
  ) {}

  hasUserRatedMovie(): boolean {
    const allUsers = this.pseudoServer.getAllUsers();
    
    return allUsers.some(user => {
      return user.reservations.some(ticket => {
        if (!ticket.rating || ticket.status !== ScreeningStatus.Watched) return false;
        
        const screenings = this.pseudoServer.getAllScreenings();
        const screening = screenings.find(s => s.id === ticket.screeningId);
        
        return screening && screening.movieId === this.movie.id;
      });
    });
  }

  getUserRating(): number | null {
    const allUsers = this.pseudoServer.getAllUsers();
    let highestRating = 0;
    
    allUsers.forEach(user => {
      user.reservations.forEach(ticket => {
        if (ticket.rating && ticket.status === ScreeningStatus.Watched) {
          const screenings = this.pseudoServer.getAllScreenings();
          const screening = screenings.find(s => s.id === ticket.screeningId);
          
          if (screening && screening.movieId === this.movie.id) {
            highestRating = Math.max(highestRating, ticket.rating);
          }
        }
      });
    });
    
    return highestRating > 0 ? highestRating : null;
  }

  onBuyTicket() {
    const dialogData: TicketPurchaseData = {
      movie: this.movie
    };

    const dialogRef = this.dialog.open(TicketPurchaseDialog, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result: TicketPurchaseResult) => {
      if (result) {
        const ticket = this.pseudoServer.createTicket(
          result.screening.id,
          result.selectedSeat,
          result.screening.price
        );

        if (ticket) {
          const notificationData: NotificationData = {
            title: 'Uspešna kupovina',
            message: `Karta kupljena uspešno! Mesto ${result.selectedSeat} za ${this.movie.title}`,
            type: 'success'
          };
          this.dialog.open(NotificationDialog, {
            width: '400px',
            data: notificationData
          });
        } else {
          const notificationData: NotificationData = {
            title: 'Neuspešna kupovina',
            message: `Mesto ${result.selectedSeat} vec zauzeto. Molim Vas pokušajte drugo mesto.`,
            type: 'error'
          };
          this.dialog.open(NotificationDialog, {
            width: '400px',
            data: notificationData
          });
        }
      }
    });
  }

  onShowDetails() {
    this.router.navigate(['/movie-details', this.movie.id]);
  }
}
