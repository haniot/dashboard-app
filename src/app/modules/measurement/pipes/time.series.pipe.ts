import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeSeries'
})
export class TimeSeriesPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'steps':
                return 'TIME-SERIES.PIPES.TIME-SERIES.STEPS';

            case 'distance':
                return 'TIME-SERIES.PIPES.TIME-SERIES.DISTANCE';

            case 'calories':
                return 'TIME-SERIES.PIPES.TIME-SERIES.CALORIES';

            case 'active_minutes':
                return 'TIME-SERIES.PIPES.TIME-SERIES.ACTIVE-MINUTES';

            case 'heart_rate':
                return 'TIME-SERIES.PIPES.TIME-SERIES.HEART-RATE';

            default:
                return 'TIME-SERIES.PIPES.NOTFOUND';
        }
    }

}
