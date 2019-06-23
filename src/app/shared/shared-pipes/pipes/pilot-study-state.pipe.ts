import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pilotStudyState'
})
export class PilotStudyStatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value?'SHARED.STUDY-ACTIVATED':'SHARED.STUDY-DISABLED';
  }

}
