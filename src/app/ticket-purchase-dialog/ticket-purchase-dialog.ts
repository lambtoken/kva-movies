import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Movie } from '../../models/movie';
import { Screening } from '../../models/screening';
import { PseudoServer } from '../pseudo-server';

export interface TicketPurchaseData {
  movie: Movie;
}

export interface TicketPurchaseResult {
  selectedDate: Date;
  selectedSeat: number;
  screening: Screening;
}

@Component({
  selector: 'app-ticket-purchase-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './ticket-purchase-dialog.html',
  styleUrl: './ticket-purchase-dialog.css'
})
export class TicketPurchaseDialog implements OnInit {
  selectedDate: Date | null = null;
  selectedSeat: number | null = null;
  availableSeats: number[] = [];
  availableScreenings: Screening[] = [];
  selectedScreening: Screening | null = null;
  minDate = new Date();
  maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  message = '';

  constructor(
    public dialogRef: MatDialogRef<TicketPurchaseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TicketPurchaseData,
    private pseudoServer: PseudoServer
  ) {}

  async ngOnInit() {
    await this.generateScreenings();
  }

  async generateScreenings() {
    try {
      const allScreenings = this.pseudoServer.getAllScreenings();
      
      this.availableScreenings = allScreenings
        .filter(screening => screening.movieId === this.data.movie.id)
        .filter(screening => screening.screeningDate > new Date())
        .sort((a, b) => a.screeningDate.getTime() - b.screeningDate.getTime());
    } catch (error) {
      console.error('Error generating screenings:', error);
    }
  }

  onScreeningSelected(screening: Screening) {
    this.selectedScreening = screening;
    this.selectedDate = screening.screeningDate;
    this.generateAvailableSeats(screening);
  }

  generateAvailableSeats(screening: Screening) {
    const totalSeats = screening.totalSeats;
    const soldSeats = screening.soldTickets.map(ticket => ticket.seatNumber);
    
    const takenSeats = new Set(soldSeats);
    for (let i = 1; i <= totalSeats; i++) {
      if (this.pseudoServer.isSeatTaken(screening.id, i)) {
        takenSeats.add(i);
      }
    }
    
    this.availableSeats = [];
    for (let i = 1; i <= totalSeats; i++) {
      if (!takenSeats.has(i)) {
        this.availableSeats.push(i);
      }
    }
  }

  onSeatSelected(seat: number) {
    if (this.selectedScreening && this.pseudoServer.isSeatTaken(this.selectedScreening.id, seat)) {
      this.message = 'Ovo mesto je rezervisano od strane drugog korisnika. Molimo izaberite drugo mesto.';
      this.generateAvailableSeats(this.selectedScreening);
      return;
    }
    
    this.selectedSeat = seat;
    this.message = '';
  }

  canPurchase(): boolean {
    return !!(this.selectedScreening && this.selectedSeat);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onPurchase(): void {
    if (!this.canPurchase() || !this.selectedScreening || !this.selectedSeat) {
      return;
    }

    if (this.pseudoServer.isSeatTaken(this.selectedScreening.id, this.selectedSeat)) {
      this.message = 'Ovo mesto je rezervisano od strane drugog korisnika. Molimo izaberite drugo mesto.';
      this.generateAvailableSeats(this.selectedScreening);
      this.selectedSeat = null;
      return;
    }

    const result: TicketPurchaseResult = {
      selectedDate: this.selectedScreening.screeningDate,
      selectedSeat: this.selectedSeat,
      screening: this.selectedScreening
    };

    this.dialogRef.close(result);
  }

  formatScreeningTime(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trimDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
  }

  getAvailableSeatCount(screening: Screening): number {
    return screening.calculateAvailableSeats();
  }
} 