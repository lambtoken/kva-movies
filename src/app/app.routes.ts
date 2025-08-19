import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { LandingPage } from './landing-page/landing-page';
import { ProfilePage } from './profile-page/profile-page';
import { ReservationsPage } from './reservations-page/reservations-page';
import { MovieDetails } from './movie-details/movie-details';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { 
    path: 'landing', 
    component: LandingPage, 
    data: { animation: 'LandingPage' } 
  },
  { 
    path: 'home', 
    component: HomePage, 
    data: { animation: 'HomePage' },
    canActivate: [AuthGuard]
  },
  { 
    path: 'movie-details/:id', 
    component: MovieDetails, 
    data: { animation: 'MovieDetails' },
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    component: ProfilePage, 
    data: { animation: 'ProfilePage' },
    canActivate: [AuthGuard]
  },
  { 
    path: 'reservations', 
    component: ReservationsPage, 
    data: { animation: 'ReservationsPage' },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'landing' }
];