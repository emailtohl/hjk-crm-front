import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpInterceptorImpl } from './httpInterceptorImpl';
import { InitData } from './init.data';
import { BooleanPipe } from './boolean.pipe';
import { IconPipe } from './icon.pipe';
import { UpdateMyPasswordComponent } from './update-my-password/update-my-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollDirective } from './scroll.directive';

export function InitDataFactory(initData: InitData): Function {
  return () => initData.load();
}

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true },
    InitData,
    { provide: APP_INITIALIZER, useFactory: InitDataFactory, deps: [InitData], multi: true },
  ],
  declarations: [ BooleanPipe, IconPipe, UpdateMyPasswordComponent, ScrollDirective ],
  entryComponents: [UpdateMyPasswordComponent],
  exports: [BooleanPipe, IconPipe, UpdateMyPasswordComponent, ScrollDirective]
})
export class SharedModule { }
