import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';

// https://v6.angular.live/guide/http#intercepting-requests-and-responses
@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {
    constructor(private router: Router, private message: NzMessageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({
            withCredentials: true,
            setHeaders: SecurityService.headers,
        });
        return next.handle(newReq).pipe(
            mergeMap((event: Observable<HttpEvent<any>>) => {
                if (event instanceof HttpResponse) {
                    // console.log(event);
                }
                return of(event);
            }),
            catchError(this.handleError),
            // Log when response observable either completes or errors
            finalize(() => {
            })
        )
        ;
    }

    private handleError = (error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            this.message.create('error', 'An error occurred:' + error.error.message);
        } else {
            switch (error.status) {
                case 200:
                    // 后台spring security若是重定向到login页面，所以解析不了401/403状态码
                    if (error.url.endsWith('login')) {
                        this.router.navigate(['login']);
                    }
                    break;
                case 401: // 未登录状态码
                    this.router.navigate(['login']);
                    break;
                case 403:
                    this.message.create('error', `没有执行权限，请切换有权限账号登录`);
                    this.router.navigate(['login']);
                    break;
                case 404:
                    break;
                case 500:
                default:
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    console.log('error', `Backend returned code ${error.status}, ` + `body was: ${error.error}`);
                    break;
            }
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
}
