import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class NotfoundComponent implements OnInit {
  private time = 5000;  

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['dashboard']);
    }, this.time);
    setInterval(() => {
      this.time -= 1000;
    }, 1000);
    
  }

}
