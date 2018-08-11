import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
/**
 * 将icon id转成可以访问后台图片的地址
 */
@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return `${environment.SERVER_URL}/images/icon-head-admin.png`;
    }
    return `${environment.SERVER_URL}/file/image/${value}`;
  }

}
