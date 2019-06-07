import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormatter'
})
export class DecimalFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.toFixed(1);
  }

}
