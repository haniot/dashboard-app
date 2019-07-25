import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceType',
  pure: true
})
export class DeviceTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'thermometer':
        return 'Termômetro';

      case 'glucometer':
        return 'Glicosímetro';

      case 'body_composition':
        return 'Composição do corpo';

      case 'blood_pressure':
        return 'Pressão sanguínea';

      case 'heart_rate':
        return 'Frequência cardíaca';

      case 'smartwatch':
        return 'SmartWatch';

      case 'smartband':
        return 'SmartBand';

      case undefined:
        return 'Fora dos parâmetros';

      default:
        return 'NÂO ENCONTRADO';
    }

  }
}
