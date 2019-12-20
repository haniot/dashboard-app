import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'gender',
    pure: true
})
export class GenderPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (`${value}`.toLowerCase()) {
            case 'male':
                return 'SHARED.PIPES.GENDER.MALE';

            case 'female':
                return 'SHARED.PIPES.GENDER.FEMALE';

            case undefined:
                return 'SHARED.PIPES.UNDEFINED'

            default:
                return 'SHARED.PIPES.NOTFOUND';
        }

    }

}
