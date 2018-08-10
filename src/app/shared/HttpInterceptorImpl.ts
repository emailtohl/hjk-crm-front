import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { finalize, tap } from 'rxjs/operators';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { InitData } from './init.data';
// https://v6.angular.live/guide/http#intercepting-requests-and-responses
@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {

    constructor(private router: Router, private message: NzMessageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({
            withCredentials: true,
            setHeaders: InitData.headers
        });
        return next.handle(newReq)
            .pipe(
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
            // 目前后台spring security是重定向到login页面，所以解析不了401/403状态码
            if (error.url.endsWith('login')) {
                this.router.navigate(['login']);
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                this.message.create('error', `Backend returned code ${error.status}, ` + `body was: ${error.error}`);
            }
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
}
