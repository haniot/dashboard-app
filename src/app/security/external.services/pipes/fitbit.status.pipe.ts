import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fitbitStatus'
})
export class FitbitStatusPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        switch (value) {
            case 'valid_token':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.VALID-TOKEN';

            case 'invalid_token':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.INVALID-TOKEN';

            case 'expired_token':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.EXPIRED-TOKEN';

            case 'invalid_refresh_token':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.INVALID-REFRESH-TOKEN';

            case 'invalid_client':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.INVALID-CLIENT';

            case 'rate_limit':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.RATE-LIMIT';

            case 'none':
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.NONE';

            default:
                return 'PATIENTS.EXTERNAL-SERVICES.PIPE.UNDEFINED';
        }
    }

}
