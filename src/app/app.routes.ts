import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AboutPage } from './about-page/about-page';
import { LandingPage } from './landing-page/landing-page';
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
    path: 'about', 
    component: AboutPage, 
    data: { animation: 'AboutPage' },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'landing' }
];