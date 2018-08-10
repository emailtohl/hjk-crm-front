import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { finalize, tap } from 'rxjs/operators';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { InitData } from './init.data';
import { Csrf } from './dto';
// https://v6.angular.live/guide/http#intercepting-requests-and-responses
@Injectable()
export class HttpInterceptorImpl implements HttpInterceptor {
    csrf: Csrf;
    token: string;

    constructor(private router: Router, private confirmServ: NzModalService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newReq = req.clone({
            withCredentials: true,
            setHeaders: InitData.headers
        });
        return next.handle(newReq)
            .pipe(
                tap(
                    // Succeeds when there is a response; ignore other events
                    event => {
                        if (event instanceof HttpResponse) {
                        }
                    },
                    // Operation failed; error is an HttpErrorResponse
                    error => {
                        console.log(error);
                    }
                ),
                // Log when response observable either completes or errors
                finalize(() => {
                })
            )
            ;
    }

}
