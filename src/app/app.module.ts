import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import {StompConfig, StompService} from '@stomp/ng2-stompjs';
import { environment } from '../environments/environment';
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

// https://stomp-js.github.io/ng2-stompjs/
const stompConfig: StompConfig = {
  // Which server?
  url: `${environment.SERVER_URL}/stomp`.replace('http', 'ws'),

  // Headers
  // Typical keys: login, passcode, host
  headers: {
    login: 'guest',
    passcode: 'guest'
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: 0, // Typical value 0 - disabled
  heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: 5000,

  // Will log diagnostics on console
  debug: false
};

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
    StompService,
    {
      provide: StompConfig,
      useValue: stompConfig
    },
    OrganizationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
