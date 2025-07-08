import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'LoginRegister',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-register.html',
  styleUrl: './login-register.css'
})
export class LoginRegister {
isLogin = true;

  email = new FormControl('', [Validators.required, Validators.email])
  password = new FormControl('', [Validators.required])

  loginForm = new FormGroup({
    email: this.email,
    password: this.password
  });

  registerForm = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: new FormControl('', [Validators.required])
  }, this.passwordMatchValidator);

  passwordMatchValidator(control: AbstractControl): { passwordMismatch: boolean } | null {
  const group = control as FormGroup;
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

  onLogin() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
    }
  }

}
