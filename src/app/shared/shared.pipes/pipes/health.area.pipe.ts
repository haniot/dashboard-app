import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'healthArea',
    pure: true
})
export class HealthAreaPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (`${value}`.toUpperCase()) {
            case 'NUTRITION':
                return 'SHARED.HEALTH-AREA-NUTRITION';

            case 'DENTISTRY':
                return 'SHARED.HEALTH-AREA-DENTISTRY';

            case 'NURSING':
                return 'SHARED.HEALTH-AREA-NURSING';

            case 'ENDOCRINOLOGY':
                return 'SHARED.HEALTH-AREA-ENDOCRINOLOGY';

            case 'OTHER':
                return 'SHARED.HEALTH-AREA-OTHER';

            case undefined:
                return 'SHARED.HEALTH-AREA-UNDEFINED';

            default:
                return 'SHARED.NOT-FOUND';
        }

    }

}
