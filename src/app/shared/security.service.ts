import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { zip, Observable, of } from 'rxjs';
import { catchError, tap, mergeMap } from 'rxjs/operators';
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

  /**
   * 返回csrf令牌
   */
  public refreshCsrf(): Observable<Csrf> {
    return this.http.get<Csrf>(`${environment.SERVER_URL}/csrf`).pipe(
      tap(csrf => SecurityService.headers[csrf.headerName] = csrf.token),
      catchError(err => of(new Csrf()))
    );
  }

  /**
   * 获取用户身份
   */
  public getPrincipal(): Observable<Principal> {
    return this.http.get<Principal>(`${environment.SERVER_URL}/principal`);
  }

  /**
   * 登录
   * @param email 识别用户唯一性的邮箱
   * @param password 登录密码
   */
  public login(email, password: string): Observable<Principal> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.refreshCsrf().pipe(
      mergeMap(csrf => {
        const body = `email=${email}&password=${password}&${csrf.parameterName}=${csrf.token}`;
        return this.http.post<Principal>(`${environment.SERVER_URL}/login`, body, { headers: headers });
      })
    );
  }

  /**
   * 登出
   */
  public logout(): Observable<void> {
    return this.refreshCsrf().pipe(
      mergeMap(csrf => this.http.post<void>(`${environment.SERVER_URL}/logout`, {}))
    );
  }

  public updateMyPassword(form: {id: number, oldPassword: string, newPassword: string}): Observable<void> {
    return this.http.post<void>(`${environment.SERVER_URL}/users/updateMyPassword`, form);
  }
}
