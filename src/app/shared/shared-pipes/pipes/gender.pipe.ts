import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch(value){
      case 'male':
       return 'MASCULINO';
      
      case 'female':
       return 'FEMININO';

      default:
        return 'NÂO ENCONTRADO';      
    }
    
  }

}
