import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pilotStudySituation'
})
export class PilotStudySituationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value?'SHARED.STUDY-ACTIVATED':'SHARED.STUDY-DISABLED';
  }

}
