import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SecurityService } from '../../../shared/security.service';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { Paging } from '../../../shared/paging';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})
export class OrganizationListComponent implements OnInit {
  query: string;
  page: Paging<Organization> = new Paging();

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
    this.organizationService.search({query: this.query, pageNumber: this.page.pageNumber}).subscribe(data => {
      this.page = data;
      console.log(data);
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

  pageIndexChange(pageNumber) {
    this.loadData();
  }
}
