import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { mergeMap, catchError } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {

    constructor(private router: Router, private confirmServ: NzModalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 跨域携带cookie，在httpBasic下抑制浏览器弹出登录窗口
        const newReq = req.clone({withCredentials: true, headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')});
        return next.handle(newReq);
    }

}
