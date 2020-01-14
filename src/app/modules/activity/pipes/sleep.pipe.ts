import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sleep'
})
export class SleepPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 'awake':
        return 'ACTIVITY.PIPES.SLEEP.AWAKE';

      case 'restless':
        return 'ACTIVITY.PIPES.SLEEP.RESTLESS';

      case 'asleep':
        return 'ACTIVITY.PIPES.SLEEP.ASLEEP';

      default:
        return 'ACTIVITY.PIPES.NOTFOUND';
    }
  }

}
