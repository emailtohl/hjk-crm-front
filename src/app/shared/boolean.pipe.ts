import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanPipe'
})
export class BooleanPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === false) {
      return '否';
    }
    return '是';
  }

}
