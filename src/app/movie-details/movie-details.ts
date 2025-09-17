import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from '../../models/movie';
import { PseudoServer } from '../pseudo-server';
import { ScreeningStatus } from '../../models/screening';
import { TicketPurchaseDialog, TicketPurchaseData, TicketPurchaseResult } from '../ticket-purchase-dialog/ticket-purchase-dialog';
import { NotificationDialog, NotificationData } from '../notification-dialog/notification-dialog';

@Component({
  selector: 'app-movie-details',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css'
})
export class MovieDetails implements OnInit {
  movie: Movie | null = null;
  userRating: number | null = null;
  averageRating: number = 0;
  totalRatings: number = 0;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pseudoServer: PseudoServer,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (!movieId) {
      this.error = 'Movie ID not found';
      this.loading = false;
      return;
    }

    try {
      await this.loadMovieData(movieId);
    } catch (error) {
      console.error('Error loading movie details:', error);
      this.error = 'Failed to load movie details';
    } finally {
      this.loading = false;
    }
  }

  private async loadMovieData(movieId: string) {
    const movies = await this.pseudoServer.getAllMovies();
    this.movie = movies.find(m => m.id === movieId) || null;

    if (!this.movie) {
      this.error = 'Movie not found';
      return;
    }

    this.userRating = this.getUserRating();

    this.calculateAverageRating();
  }

  private getUserRating(): number | null {
    const currentUser = this.pseudoServer.getCurrentUser();
    if (!currentUser || !this.movie) return null;
    const movieId = this.movie.id; // Store id to avoid null checks

    for (const ticket of currentUser.reservations) {
      if (ticket.rating && ticket.status === ScreeningStatus.Watched) {
        const screenings = this.pseudoServer.getAllScreenings();
        const screening = screenings.find(s => s.id === ticket.screeningId && s.movieId === movieId);
        
        if (screening) {
          return ticket.rating;
        }
      }
    }
    
    return null;
  }

  private calculateAverageRating() {
    if (!this.movie) return;
    const movieId = this.movie.id; // Store id to avoid null checks

    const allUsers = this.pseudoServer.getAllUsers();
    const ratings: number[] = [];
    
    allUsers.forEach(user => {
      user.reservations.forEach(ticket => {
        if (ticket.rating && ticket.status === ScreeningStatus.Watched) {
          const screenings = this.pseudoServer.getAllScreenings();
          const screening = screenings.find(s => s.id === ticket.screeningId && s.movieId === movieId);
          if (screening) {
            ratings.push(ticket.rating);
          }
        }
      });
    });

    this.totalRatings = ratings.length;
    this.averageRating = ratings.length > 0 ? 
      ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getMovieDuration(): string {
    if (!this.movie) return '';
    
    const seed = this.movie.title.length + this.movie.director.length;
    const duration = 80 + (seed % 60);
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.floor(rating));
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  buyTicket() {
    if (!this.movie) return;

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
            message: `Karta kupljena uspešno! Mesto ${result.selectedSeat} za ${this.movie!.title}`,
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
}
