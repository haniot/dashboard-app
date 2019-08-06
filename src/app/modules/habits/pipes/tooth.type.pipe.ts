import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toothType',
    pure: true
})
export class ToothTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'deciduous_tooth':
                return 'HABITS.PIPES.TOOTH-TYPE.DECIDUOUS-TOOTH';

            case 'permanent_tooth':
                return 'HABITS.PIPES.TOOTH-TYPE.PERMANENT-TOOTH';

            default:
                return 'HABITS.PIPES.UNDEFINED';
        }

    }
}
