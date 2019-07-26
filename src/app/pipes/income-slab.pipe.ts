import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'incomeSlab'
})
export class IncomeSlabPipe implements PipeTransform {

    transform(value: number, args?: any): string {
        if (value <= 2) return 'Upto 2';
        else if (value > 2 && value <= 3) return '2 - 3';
        else if (value > 3 && value <= 5) return '3 - 5';
        else if (value > 5 && value <= 10) return '5 - 10';
        else if (value > 10 && value <= 20) return '10 - 20';
        else if (value > 20 && value < 50) return '20 - 50';
        else return '50 + ';
    }

}
