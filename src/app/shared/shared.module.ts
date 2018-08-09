import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorImpl } from './HttpInterceptorImpl';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true }],
  declarations: []
})
export class SharedModule { }
