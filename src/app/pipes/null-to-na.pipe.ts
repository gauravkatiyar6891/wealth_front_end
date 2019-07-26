import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullToNa'
})
export class NullToNaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = value ? value : 'N.A.';
    return value;
  }

}
