import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PseudoServer } from '../pseudo-server';

@Component({
  selector: 'LoginRegister',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css'
})
export class LoginRegister {
  isLogin = true;
  errorMessage = '';
  successMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, this.passwordMatchValidator);

  passwordMatchValidator(control: AbstractControl): { passwordMismatch: boolean } | null {
    const group = control as FormGroup;
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  constructor(private server: PseudoServer, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        if (this.server.loginUser(email!, password!)) {
          this.successMessage = 'Prijava uspešna!';
          this.errorMessage = '';
          this.loginForm.reset();
          setTimeout(() => {
            // used window location, probably not the best practice but ensures redirection works
            window.location.href = '/home';
          }, 1000);
        } else {
          this.errorMessage = 'Neispravni podaci za prijavu';
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Došlo je do greške prilikom prijave. Molim pokušajte ponovo.';
        this.successMessage = '';
      }
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;
      
      try {
        if (this.server.registerUser(firstName!, lastName!, email!, password!, '', '')) {
          this.successMessage = 'Registracija uspešna! Redirektujemo Vas na početnu stranicu...';
          this.errorMessage = '';
          this.registerForm.reset();
          setTimeout(() => {
            // used window location, probably not the best practice but ensures redirection works
            window.location.href = '/home';
          }, 1000);
        } else {
          this.errorMessage = 'Korisnik sa tim email-om već postoji';
          this.successMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Došlo je do greške prilikom registracije. Molim pokušajte ponovo.';
        this.successMessage = '';
      }
    }
  }

}
