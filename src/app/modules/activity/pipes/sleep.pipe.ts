import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sleep'
})
export class SleepPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 'awake':
        return 'MEASUREMENTS.PIPES.SLEEP.AWAKE';

      case 'restless':
        return 'MEASUREMENTS.PIPES.SLEEP.RESTLESS';

      case 'asleep':
        return 'MEASUREMENTS.PIPES.SLEEP.ASLEEP';

      default:
        return 'MEASUREMENTS.PIPES.NOTFOUND';
    }
  }

}
