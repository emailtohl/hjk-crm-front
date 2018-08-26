import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
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
  query = '';
  page: Paging<Organization> = new Paging();
  loading = false;
  importUrl = `${environment.SERVER_URL}/organization/batchCreate`;
  withRefresh = false;

  constructor(
    private organizationService: OrganizationService,
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.page.pageNumber = 0;
    this.loadData();
  }

  search = (query: string): Observable<Paging<Organization>> => {
    return this.organizationService.search({query: query, page: 0});
  }

  loadData(pageIndex: number = 1) {
    this.loading = true;
    this.organizationService.search({query: this.query, page: pageIndex - 1}).subscribe(data => {
      this.page = data;
      this.loading = false;
    }, err => this.loading = false);
  }

  getDetail(id: number): void {
    this.router.navigate(['back/organization/detail/businessKey', id, 'taskId', 0]);
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
    this.page.pageNumber = pageNumber;
    this.loadData();
  }

  exportExcel() {
    window.open(`${environment.SERVER_URL}/organization/export`);
  }

  uploadChange(event) {
    if (event.type !== 'success') {
      return;
    }
    this.message.create('success', `创建条目${event.file && event.file.response && event.file.response.count}`);
    this.loadData();
  }
}
