import { Pipe, PipeTransform } from '@angular/core';
import { Config } from '../config';
/**
 * 将icon id转成可以访问后台图片的地址
 */
@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return Config.backend + `/images/丰都名山.jpg`;
    }
    return Config.backend + `/file/image/${value}`;
  }

}
