import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Csrf, Principal } from './entities';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  public static headers = {
    // 跨域携带cookie，在httpBasic下抑制浏览器弹出登录窗口
    'X-Requested-With': 'XMLHttpRequest',
  };
  public static csrf: Csrf;
  public static sessionId = '';

  constructor(private http: HttpClient) { }

  /**
   * 将csrf和sessionId刷新到拦截器上
   */
  public refresh() {
    zip(
      this.http.get<Csrf>(`${environment.SERVER_URL}/csrf`),
      this.http.get<string>(`${environment.SERVER_URL}/token`)
    )
    .pipe(
      catchError(([csrf, token]) => {
        return [csrf, token];
      }
      ))
    .subscribe(([csrf, token]) => {
      SecurityService.sessionId = token;
      SecurityService.csrf = csrf;
      SecurityService.headers[csrf.headerName] = csrf.token;
      SecurityService.headers['X-Auth-Token'] = token;
    }, () => { }, () => { })
    ;
  }

  public getPrincipal(): Observable<Principal> {
    return this.http.get<Principal>(`${environment.SERVER_URL}/principal`);
  }
}
