import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MyInvoiceListComponent } from './my-invoice-list/my-invoice-list.component';
import { MyInvoiceApplyComponent } from './my-invoice-apply/my-invoice-apply.component';
import { MyInvoiceDetailComponent } from './my-invoice-detail/my-invoice-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: MyInvoiceListComponent },
  { path: 'apply', component: MyInvoiceApplyComponent },
  { path: 'detail', component: MyInvoiceDetailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  declarations: [
    MyInvoiceListComponent,
    MyInvoiceApplyComponent,
    MyInvoiceDetailComponent
  ],
  providers: []
})
export class InvoiceModule { }
