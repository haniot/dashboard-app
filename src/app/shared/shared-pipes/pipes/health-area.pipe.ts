import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'healthArea',
    pure: true
})
export class HealthAreaPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'nutrition':
                return 'SHARED.HEALTH-AREA-NUTRITION';

            case 'dentistry':
                return 'SHARED.HEALTH-AREA-DENTISTRY';

            case undefined:
                return 'SHARED.HEALTH-AREA-UNDEFINED';

            default:
                return 'SHARED.NOT-FOUND';
        }

    }

}
