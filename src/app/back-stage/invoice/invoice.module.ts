import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { FinanceHandleComponent } from './invoice-detail/finance-handle/finance-handle.component';
import { ForeignHandleComponent } from './invoice-detail/foreign-handle/foreign-handle.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: InvoiceListComponent },
  { path: 'detail/businessKey/:businessKey/taskId/:taskId', component: InvoiceDetailComponent },
  { path: 'finance_handle/businessKey/:businessKey/taskId/:taskId', component: FinanceHandleComponent },
  { path: 'foreign_handle/businessKey/:businessKey/taskId/:taskId', component: ForeignHandleComponent },
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
    InvoiceDetailComponent,
    InvoiceListComponent,
    FinanceHandleComponent,
    ForeignHandleComponent
  ]
})
export class InvoiceModule { }
