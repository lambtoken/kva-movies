import { Component } from '@angular/core';
import { LoginRegister } from '../login-register/login-register';

@Component({
  selector: 'app-landing-page',
  imports: [LoginRegister],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

}
