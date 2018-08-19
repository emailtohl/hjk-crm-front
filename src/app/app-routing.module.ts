import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ServiceCounterComponent } from './service-counter/service-counter.component';
import { BackStageComponent } from './back-stage/back-stage.component';
import { CarouselComponent } from './service-counter/carousel/carousel.component';
import { MyTaskComponent } from './back-stage/my-task/my-task.component';

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
  { path: 'back', component: BackStageComponent, children: [
    { path: '', redirectTo: 'my-task', pathMatch: 'full' },
    { path: 'my-task', component: MyTaskComponent },
    // 懒加载的Module不能在APPModule中import
    { path: 'organization', loadChildren: './back-stage/organization/organization.module#OrganizationModule' },
    { path: 'invoice', loadChildren: './back-stage/invoice/invoice.module#InvoiceModule' },
  ] },
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
