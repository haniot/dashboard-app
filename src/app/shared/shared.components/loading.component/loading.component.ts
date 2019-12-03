import { Component, Input } from '@angular/core';
import { LoadingService } from './service/loading.service'

@Component({
    selector: 'loading-component',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
    @Input() visible: boolean
    state: boolean

    constructor(private loadingService: LoadingService) {
        this.loadingService.change.subscribe((state) => {
            this.state = state
        })
    }

}
