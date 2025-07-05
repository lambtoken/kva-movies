import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { AboutPage } from './about-page/about-page';

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
  { path: '**', redirectTo: 'page1' }
];