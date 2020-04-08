import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../shared.services/local.storage.service'
import { PilotStudy } from '../../modules/pilot.study/models/pilot.study'

export enum LogicalStrategy {
    and = 'and',
    or = 'or'
}

@Directive({
    selector: '[includeDataType][dataTypes][strategy]'
})
export class IncludeDataTypeDirective implements OnInit {
    @Input() dataTypes: string[]
    @Input() strategy: LogicalStrategy = LogicalStrategy.and;

    constructor(
        private _element: ElementRef,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit(): void {
        this.localStorageService.pilotStudySelected.subscribe(() => {
            const pilotSelected: PilotStudy = JSON.parse(this.localStorageService.getItem('selectedPilotStudy'));
            if (pilotSelected) {
                this._element.nativeElement.style.display = this.verify(this.dataTypes, pilotSelected.data_types) ? '' : 'none';
            }
        });
    }

    verify(dataTypes: any[], expected: any[]): boolean {

        if (expected.length === 0) {
            return true;
        }

        let accepted = false;

        if (this.strategy === LogicalStrategy.and) {
            accepted = expected.every(scope => dataTypes.includes(scope))
        } else {
            accepted = expected.some(scope => dataTypes.includes(scope))
        }

        return accepted;
    }

}
