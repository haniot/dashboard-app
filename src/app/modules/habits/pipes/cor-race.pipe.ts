import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'corAndRace',
    pure: true
})
export class CorAndRacePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'white':
                return 'HABITS.PIPES.COLOR-RACE.WHITE';

            case 'black':
                return 'HABITS.PIPES.COLOR-RACE.BLACK';

            case 'parda':
                return 'HABITS.PIPES.COLOR-RACE.PARDA';

            case 'yellow':
                return 'HABITS.PIPES.COLOR-RACE.YELLOW';

            default:
                return 'HABITS.PIPES.UNDEFINED';
        }

    }
}
