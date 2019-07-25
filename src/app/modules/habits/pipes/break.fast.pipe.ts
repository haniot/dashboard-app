import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'breakFast',
    pure: true
})
export class BreakFastPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'never':
                return 'HABITS.PIPES.BREAKFAST.NEVER';

            case 'sometimes':
                return 'HABITS.PIPES.BREAKFAST.SOMETIMES';

            case 'almost_everyday':
                return 'HABITS.PIPES.BREAKFAST.ALMOST-EVERYDAY';

            case 'everyday':
                return 'HABITS.PIPES.BREAKFAST.EVERYDAY';

            default:
                return 'HABITS.PIPES.DO-NOT-KNOW';
        }

    }
}
