import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'lesionType',
    pure: true
})
export class LesionTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'white_spot_lesion':
                return 'HABITS.PIPES.TYPE-LESION.WHITE-SPOT-LESION';

            case 'cavitated_lesion':
                return 'HABITS.PIPES.TYPE-LESION.CAVITATED-LESION';

            default:
                return 'HABITS.PIPES.UNDEFINED';
        }

    }
}
