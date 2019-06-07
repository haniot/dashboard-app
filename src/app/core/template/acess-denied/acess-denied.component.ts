import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'acess-denied',
  templateUrl: './acess-denied.component.html',
  styleUrls: ['./acess-denied.component.scss']
})
export class AcessDeniedComponent {

  constructor(private router: Router) { }


  onBack() {
    this.router.navigate(['/']);
  }

}
