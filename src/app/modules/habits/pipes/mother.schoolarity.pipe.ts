import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'motherSchoolarity',
    pure: true
})
export class MotherSchoolarityPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case 'unlettered_elementary_one_incomplete':
                return 'HABITS.PIPES.MOTHER-SCHOOLARITY.UNLETTERED';

            case 'elementary_one_elementary_two_incomplete':
                return 'HABITS.PIPES.MOTHER-SCHOOLARITY.ELEMENTARY-ONE-TWO-INCOMPLETE';

            case 'elementary_two_high_school_incomplete':
                return 'HABITS.PIPES.MOTHER-SCHOOLARITY.ELEMENTARY-TWO-HIGH-SCHOOL';

            case 'medium_graduation_incomplete':
                return 'HABITS.PIPES.MOTHER-SCHOOLARITY.MEDIUM-GRADUATION-INCOMPLETE';

            case 'graduation_complete':
                return 'HABITS.PIPES.MOTHER-SCHOOLARITY.GRADUATION-COMPLETE';

            default:
                return 'HABITS.PIPES.UNDEFINED';
        }

    }
}
