import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    console.log("%cHANIoT%cby NUTES/UEPB", '\nfont-size: 40px;\nfont-weight: bold;\nfont-style: italic;\ncolor: #00a594;\nfont-style: italic;\n', '\n    font-size: 12px;\n    font-weight: bold;\n    font-style: italic;\n    padding-left: 5px;\n    color: #555;\n')
  }
}
