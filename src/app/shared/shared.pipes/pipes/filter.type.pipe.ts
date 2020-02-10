import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterType'
})
export class FilterTypePipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'today':
                return 'MEASUREMENTS.MEASUREMENT-CARD.TODAY';

            case '1w':
                return 'MEASUREMENTS.MEASUREMENT-CARD.WEEK'

            case '1m':
                return 'MEASUREMENTS.MEASUREMENT-CARD.MONTH'

            case '1y':
                return 'MEASUREMENTS.MEASUREMENT-CARD.YEAR';

            case 'period':
                return 'MEASUREMENTS.MEASUREMENT-CARD.PERIOD';
        }
    }

}
