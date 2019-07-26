import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ageTransform'
})
export class AgePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        if (value >= 20 && value <= 27) return '20 - 27';
        else if (value > 27 && value <= 35) return '28 - 35';
        else if (value > 35 && value <= 45) return '36 - 45';
        else if (value > 45 && value <= 55) return '46 - 55';
        else if (value > 55 && value < 60) return '56 - 60';
        else return '60 +';
    }

}
