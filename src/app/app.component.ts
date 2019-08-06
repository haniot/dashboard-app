import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    ngOnInit() {
        const style1 = 'font-size: 40px;font-weight: bold;font-style: italic;color: #00a594;font-style: italic;'
        const style2 = 'font-size: 12px;font-weight: bold;font-style: italic;padding-left: 5px;color: #555;';
        console.log('%cHANIoT%cby NUTES/UEPB', style1, style2);
    }
}
