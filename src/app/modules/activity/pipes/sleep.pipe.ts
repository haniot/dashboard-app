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

      case 'rem':
        return 'ACTIVITY.PIPES.SLEEP.REM';

      case 'light':
        return 'ACTIVITY.PIPES.SLEEP.LIGHT';

      case 'deep':
        return 'ACTIVITY.PIPES.SLEEP.DEEP';

      default:
        return 'ACTIVITY.PIPES.NOTFOUND';
    }
  }

}
