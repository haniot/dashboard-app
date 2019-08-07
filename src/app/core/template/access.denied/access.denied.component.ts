import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'acess-denied',
  templateUrl: './access.denied.component.html',
  styleUrls: ['./access.denied.component.scss']
})
export class AccessDeniedComponent {

  constructor(private router: Router) { }


  onBack() {
    this.router.navigate(['/app']);
  }

}
