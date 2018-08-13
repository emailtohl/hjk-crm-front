import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MyOrganizationApplyComponent } from './my-organization-apply/my-organization-apply.component';
import { MyOrganizationListComponent } from './my-organization-list/my-organization-list.component';
import { MyOrganizationDetailComponent } from './my-organization-detail/my-organization-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'apply', component: MyOrganizationApplyComponent },
  { path: 'list', component: MyOrganizationListComponent },
  { path: 'detail', component: MyOrganizationDetailComponent },
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
    MyOrganizationApplyComponent,
    MyOrganizationListComponent,
    MyOrganizationDetailComponent
  ]
})
export class OrganizationModule { }
