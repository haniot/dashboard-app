import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'healthArea'
})
export class HealthAreaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 'NUTRITION':
       return 'NUTRIÇÃO';
      
      case 'DENTISTRY':
       return 'DENTISTA';

      default:
        return 'NÂO ENCONTRADO';      
    }
    
  }

}
