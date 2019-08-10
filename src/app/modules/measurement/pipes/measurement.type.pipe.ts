import {Pipe, PipeTransform} from '@angular/core';
import {MeasurementType} from "../models/measurement";

@Pipe({
    name: 'measurementType'
})
export class MeasurementTypePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        switch (value) {
            case MeasurementType.weight:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WEIGHT';

            case MeasurementType.height:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.HEIGHT';

            case MeasurementType.body_fat:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.FAT';

            case MeasurementType.waist_circumference:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.WAIST-CIRCUMFERENCE';

            case MeasurementType.body_temperature:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BODY-TEMPERATURE';

            case MeasurementType.blood_glucose:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-GLUCOSE';

            case MeasurementType.blood_pressure:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.BLOOD-PRESSURE';

            case MeasurementType.heart_rate:
                return 'MEASUREMENTS.PIPES.MEASUREMENT-TYPE.HEART-RATE';

            default:
                return 'MEASUREMENTS.PIPES.NOTFOUND';
        }
    }

}
