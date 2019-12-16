import { Pipe, PipeTransform } from '@angular/core';
import { EnumMeasurementType } from '../models/measurement';

@Pipe({
    name: 'measurementType'
})
export class MeasurementTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case EnumMeasurementType.WEIGHT:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WEIGHT';

            case EnumMeasurementType.HEIGHT:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.HEIGHT';

            case EnumMeasurementType.BODY_FAT:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.FAT';

            case EnumMeasurementType.WAIST_CIRCUMFERENCE:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WAIST-CIRCUMFERENCE';

            case EnumMeasurementType.BODY_TEMPERATURE:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BODY-TEMPERATURE';

            case EnumMeasurementType.BLOOD_GLUCOSE:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-GLUCOSE';

            case EnumMeasurementType.BLOOD_PRESSURE:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-PRESSURE';

            default:
                return 'MEASUREMENTS.PIPES.NOTFOUND';
        }
    }

}
