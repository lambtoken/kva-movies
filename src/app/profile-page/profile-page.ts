import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PseudoServer } from '../pseudo-server';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  isEditing = false;
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    favoriteGenres: [] as string[]
  };
  message = '';
  availableGenres: string[] = [];

  constructor(private pseudoServer: PseudoServer) {}

  async ngOnInit() {
    this.loadUserData();
    await this.loadAvailableGenres();
  }

  async loadAvailableGenres() {
    try {
      const movies = await this.pseudoServer.getAllMovies();
      const genresSet = new Set<string>();
      movies.forEach(movie => {
        movie.genres.forEach(genre => genresSet.add(genre));
      });
      this.availableGenres = Array.from(genresSet).sort();
    } catch (error) {
      console.error('Error loading genres:', error);
      // fallback
      this.availableGenres = [
        'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Adventure',
        'Fantasy', 'Mystery', 'Crime', 'Animation', 'Documentary', 'War', 'Western', 'Musical'
      ];
    }
  }

  loadUserData() {
    this.user = this.pseudoServer.getCurrentUser();
    if (this.user) {
      this.editForm = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        favoriteGenres: [...this.user.favoriteGenres]
      };
    }
  }

  startEditing() {
    this.isEditing = true;
    this.message = '';
  }

  cancelEditing() {
    this.isEditing = false;
    this.loadUserData(); 
    this.message = '';
  }

  saveChanges() {
    if (!this.user) return;

    this.user.firstName = this.editForm.firstName;
    this.user.lastName = this.editForm.lastName;
    this.user.email = this.editForm.email;
    this.user.phone = this.editForm.phone;
    this.user.address = this.editForm.address;
    this.user.favoriteGenres = [...this.editForm.favoriteGenres];

    this.updateUserInStorage();

    this.isEditing = false;
    this.message = 'Profile updated successfully!';
    
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  toggleGenre(genre: string) {
    const index = this.editForm.favoriteGenres.indexOf(genre);
    if (index > -1) {
      this.editForm.favoriteGenres.splice(index, 1);
    } else {
      this.editForm.favoriteGenres.push(genre);
    }
  }

  isGenreSelected(genre: string): boolean {
    return this.editForm.favoriteGenres.includes(genre);
  }

  private updateUserInStorage() {
    const storageStr = localStorage.getItem("kva-movies");
    if (!storageStr) return;

    const storage: { users: User[] } = JSON.parse(storageStr);
    const userIndex = storage.users.findIndex(u => u.email === this.user?.email);
    
    if (userIndex !== -1) {
      storage.users[userIndex] = this.user!;
      localStorage.setItem("kva-movies", JSON.stringify(storage));
    }
  }
}
