import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private authService:AuthService,
  ){}

  openClose() {
    const div = document.getElementById('miDiv');
    if (div) {
      div.style.transform = div.style.transform == 'translateX(0%)' ? 'translateX(-100%)' : 'translateX(0%)'
    }
  }

  logOut(){
    this.authService.logOut();
  }


  get isLoggedIn() {
    return this.authService.isLoggedIn
  }


}
