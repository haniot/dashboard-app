import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const date = new Date(value);

    return date.toLocaleDateString('pt-BR') + ' as ' + date.toLocaleTimeString('pt-BR') + ' horas.';


  }

  dateToString(date: Date): string {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC', timeZoneName: 'short' };
   
    return date.toLocaleDateString('en-US', options);
  }

  stringToDate(str: string): Date {

    return new Date(str);
  }


}
