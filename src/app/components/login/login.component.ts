import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isRightPanelActive: boolean = false;

  signInData = {
    email: '',
    password: ''
  };

  signUpData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
  ) { }

  togglePanel(isSignUp: boolean) {
    this.isRightPanelActive = isSignUp;
  }

  onSignIn(event: Event) {
    this.authService.signInEmailPassword(this.signInData.email, this.signInData.password);
  }

  onSignUp(event: Event) {
    if (this.signUpData.password == this.signUpData.confirmPassword) {
      this.authService.signUpEmailAndPassword(this.signUpData.email, this.signUpData.password, this.signUpData.name);
      this.signInData = {email: '',password: ''};
    } else {
      this.alertService.error("error en password");
    }
  }

  loginGoogle(){
    this.authService.loginGoogle();
  }

}
