import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'teethBushing',
    pure: true
})
export class TeethbushingPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'none':
                return 'HABITS.PIPES.TEETH-BRUSHING.NONE';

            case 'once':
                return 'HABITS.PIPES.TEETH-BRUSHING.ONCE';

            case 'twice':
                return 'HABITS.PIPES.TEETH-BRUSHING.TWICE';

            case 'three_more':
                return 'HABITS.PIPES.TEETH-BRUSHING.THREE-MORE';

            default:
                return 'HABITS.PIPES.UNDEFINED';
        }

    }
}
