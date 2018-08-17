import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';
import { OrganizationEditComponent } from './organization-edit/organization-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: OrganizationListComponent },
  { path: 'detail/businessKey/:businessKey/taskId/:taskId', component: OrganizationDetailComponent },
  { path: 'edit/:id', component: OrganizationEditComponent },
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
    OrganizationListComponent,
    OrganizationDetailComponent,
    OrganizationEditComponent
  ]
})
export class OrganizationModule { }
