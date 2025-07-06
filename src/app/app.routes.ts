import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AboutPage } from './about-page/about-page';
import { LandingPage } from './landing-page/landing-page';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { 
    path: 'home', 
    component: HomePage, 
    data: { animation: 'HomePage' }
  },
  { 
    path: 'about', 
    component: AboutPage, 
    data: { animation: 'AboutPage' } 
  },
  { 
    path: 'landing', 
    component: LandingPage, 
    data: { animation: 'LandingPage' } 
  },
  { path: '**', redirectTo: 'home' }
];