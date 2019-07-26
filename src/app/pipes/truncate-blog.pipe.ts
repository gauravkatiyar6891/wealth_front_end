import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateBlog'
})
export class TruncateBlogPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return value.substring(0, 85) + '...';
  }

}
