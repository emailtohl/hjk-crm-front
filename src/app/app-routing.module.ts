import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ServiceCounterComponent } from './service-counter/service-counter.component';
import { BackStageComponent } from './back-stage/back-stage.component';
import { CarouselComponent } from './service-counter/carousel/carousel.component';

const routes: Routes = [
  { path: '', redirectTo: 'service', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'service', component: ServiceCounterComponent, children: [
      { path: '', redirectTo: 'carousel', pathMatch: 'full' },
      { path: 'carousel', component: CarouselComponent },
      // 懒加载的Module不能在APPModule中import
      { path: 'organization', loadChildren: './service-counter/organization/organization.module#OrganizationModule' },
      { path: 'invoice', loadChildren: './service-counter/invoice/invoice.module#InvoiceModule' },
    ]
  },
  { path: 'back', component: BackStageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
