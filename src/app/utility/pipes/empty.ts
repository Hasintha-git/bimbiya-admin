import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'empty'})
export class Empty implements PipeTransform {
  transform(value: string): string {
    let result = '';
    if (value === undefined || value === '' || value === null || value === 'null') {
      result = '--';
    } else {
      result = value;
    }
    return result;
  }
}
