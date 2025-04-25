import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //public static viewSpinner=false;
  private static _viewSpinner = new BehaviorSubject<boolean>(false);
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


  static setViewSpinner(value: boolean) {
    AppComponent._viewSpinner.next(value);
  }

  static get viewSpinner$(): Observable<boolean> {
    return AppComponent._viewSpinner.asObservable();
  }

  get viewSpinner$(): Observable<boolean> {
    return AppComponent._viewSpinner.asObservable();
  }
}
