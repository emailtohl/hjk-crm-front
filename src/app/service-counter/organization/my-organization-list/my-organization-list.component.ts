import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SecurityService } from '../../../shared/security.service';
import { OrganizationService } from '../../../model-interface/organization.service';

@Component({
  selector: 'app-my-organization-list',
  templateUrl: './my-organization-list.component.html',
  styleUrls: ['./my-organization-list.component.css']
})
export class MyOrganizationListComponent implements OnInit {
  dataSet: Array<any>;
  constructor(
    private organizationService: OrganizationService,
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.loadData();
    this.securityService.refresh();
  }

  loadData() {
    this.organizationService.myRegisterOrganization().subscribe(data => {
      this.dataSet = data;
    });
  }

  getDetail(id: number): void {
    this.router.navigate(['service/organization/detail', id]);
  }

  delete(id: number): void {
    this.modalService.confirm({
      nzTitle: '警告！',
      nzContent: '<b style="color: red;">请确认是否删除此信息！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.organizationService.delete(id).subscribe(data => {
          this.message.create('success', '已成功删除');
          this.loadData();
        });
      },
      nzCancelText: '否',
      nzOnCancel: () => {}
    });
  }

}
