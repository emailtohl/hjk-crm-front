import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpInterceptorImpl } from './httpInterceptorImpl';
import { InitData } from './init.data';
import { BooleanPipe } from './boolean.pipe';
import { IconPipe } from './icon.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollDirective } from './scroll.directive';
import { SelectUserComponent } from './select-user/select-user.component';
import { SearchInputComponent } from './search-input/search-input.component';

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
  declarations: [
    BooleanPipe,
    IconPipe,
    ScrollDirective,
    SelectUserComponent,
    SearchInputComponent,
  ],
  entryComponents: [
    SelectUserComponent,
    SearchInputComponent
  ],
  exports: [
    BooleanPipe,
    IconPipe,
    ScrollDirective,
    SelectUserComponent,
    SearchInputComponent
  ]
})
export class SharedModule { }
