import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  ngOnInit(): void {
  }

  openClose(){
    const div = document.getElementById('miDiv');
      if(div){
        div.style.transform=div.style.transform=='translateX(0%)'? 'translateX(-100%)':'translateX(0%)'
      }
  }
  
}
