import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'healthArea'
})
export class HealthAreaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 'nutrition':
       return 'NUTRIÇÃO';
      
      case 'dentistry':
       return 'DENTISTA';

      default:
        return 'NÂO ENCONTRADO';      
    }
    
  }

}
