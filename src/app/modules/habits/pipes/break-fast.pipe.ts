import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'breakFast',
    pure: true
})
export class BreakFastPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'never':
                return 'Nunca';

            case 'sometimes':
                return 'As vezes';

            case 'almost_everyday':
                return 'Quase todos os dias';

            case 'everyday':
                return 'Todos os dias';

            default:
                return 'Não sei/Não lembro';
        }

    }
}
