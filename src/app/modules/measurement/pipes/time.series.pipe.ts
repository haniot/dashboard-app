import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeSeries'
})
export class TimeSeriesPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'steps':
                return 'MEASUREMENTS.PIPES.TIME-SERIES.STEPS';

            case 'distance':
                return 'MEASUREMENTS.PIPES.TIME-SERIES.DISTANCE';

            case 'calories':
                return 'MEASUREMENTS.PIPES.TIME-SERIES.CALORIES';

            case 'active_minutes':
                return 'MEASUREMENTS.PIPES.TIME-SERIES.ACTIVE-MINUTES';

            case 'heart_rate':
                return 'MEASUREMENTS.PIPES.TIME-SERIES.HEART-RATE';

            default:
                return 'MEASUREMENTS.PIPES.NOTFOUND';
        }
    }

}
