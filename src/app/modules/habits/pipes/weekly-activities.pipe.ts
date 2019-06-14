import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'weeklyActivity',
    pure: true
})
export class WeeklyActivityPipe implements PipeTransform {

    transform(value: any, args?: any): any {

        switch (value) {

            case 'soccer':
                return 'Futebol';

            case 'futsal':
                return 'Futsal';

            case 'handball':
                return 'Handebol';

            case 'basketball':
                return 'Basquete';

            case 'skates':
                return 'Andar de patins ou skate';

            case 'athletics':
                return 'Atletismo';

            case 'swim':
                return 'Natação';

            case 'gymnastics':
                return 'Gisnática olímpica ou rítmica';

            case 'fight':
                return 'Judõ, Karatê, Capoeira ou outras lutas';

            case 'dance':
                return 'Ballet ou outros tipos de danças';

            case 'run':
                return 'Correr';

            case 'ride a bike':
                return 'Andar de bicicleta';

            case 'walking as a physical exercise':
                return 'Caminhada como exercício físico';

            case 'walking as a means of transport':
                return 'Caminhada como meio de transporte';

            case 'volleyball':
                return 'Vôlei de quadra';

            case 'musculation':
                return 'Musculação';

            case 'abdominal exercise':
                return 'Exercicios abdominais';

            case 'tennis':
                return 'Tênis de quadra ou de mesa';

            case 'walk with dog':
                return 'Passear com o cachorro';

            case 'gymnastics gym':
                return 'Ginástica de academia';

            case 'no activity':
                return 'Nenhuma atividade';

            case undefined:
                return 'Fora dos parâmetros';

            default:
                return 'NÂO ENCONTRADO';
        }

    }
}

