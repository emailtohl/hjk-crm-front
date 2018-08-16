import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ServiceCounterComponent } from './service-counter/service-counter.component';
import { BackStageComponent } from './back-stage/back-stage.component';
import { SharedModule } from './shared/shared.module';
import { CarouselComponent } from './service-counter/carousel/carousel.component';
import { MyTaskComponent } from './back-stage/my-task/my-task.component';
import { OrganizationService } from './model-interface/organization.service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ServiceCounterComponent,
    BackStageComponent,
    MyTaskComponent,
    CarouselComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    OrganizationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
