import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'physicalActivity'
})
export class PhysicalActivityPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (`${value}`.toLowerCase()) {
            case 'run':
                return 'ACTIVITY.PIPES.PHYSICAL-ACTIVITY.RUN';

            case 'walk':
                return 'ACTIVITY.PIPES.PHYSICAL-ACTIVITY.WALK';

            case 'swim':
                return 'ACTIVITY.PIPES.PHYSICAL-ACTIVITY.SWIM';

            case 'bike':
                return 'ACTIVITY.PIPES.PHYSICAL-ACTIVITY.BIKE';

            default:
                return value;
        }
    }

}
