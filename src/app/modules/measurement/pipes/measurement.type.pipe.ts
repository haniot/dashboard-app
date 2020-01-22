import { Pipe, PipeTransform } from '@angular/core';
import { EnumMeasurementType } from '../models/measurement';

@Pipe({
    name: 'measurementType'
})
export class MeasurementTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case EnumMeasurementType.weight || 'weight':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WEIGHT';

            case EnumMeasurementType.height || 'height':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.HEIGHT';

            case EnumMeasurementType.body_fat || 'body_fat':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.FAT';

            case EnumMeasurementType.waist_circumference || 'waist_circumference':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WAIST-CIRCUMFERENCE';

            case EnumMeasurementType.body_temperature || 'body_temperature':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BODY-TEMPERATURE';

            case EnumMeasurementType.blood_glucose || 'blood_glucose':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-GLUCOSE';

            case EnumMeasurementType.blood_pressure || 'blood_pressure':
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-PRESSURE';

            default:
                return 'MEASUREMENTS.PIPES.NOTFOUND';
        }
    }

}
