import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorImpl } from './HttpInterceptorImpl';
import { InitData } from './init.data';

export function InitDataFactory(initData: InitData): Function {
  return () => initData.load();
}

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true },
    InitData,
    { provide: APP_INITIALIZER, useFactory: InitDataFactory, deps: [InitData], multi: true },
  ],
  declarations: []
})
export class SharedModule { }
