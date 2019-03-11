import { Component, OnInit } from '@angular/core';

import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
    // this.http.get<any>(`${environment.api_url}/auth/me`).subscribe(data => {
    //   this.user = data.user;
    // });
  }

}
