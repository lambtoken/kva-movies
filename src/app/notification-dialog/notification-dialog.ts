import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface NotificationData {
  message: string;
  title?: string;
  type?: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './notification-dialog.html',
  styleUrl: './notification-dialog.css'
})
export class NotificationDialog {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationData
  ) {
    this.data.title = this.data.title || 'Notification';
    this.data.type = this.data.type || 'info';
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      default: return 'info';
    }
  }
} 