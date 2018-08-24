import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization, Flow } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Principal } from '../../../shared/entities';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {
  businessKey: string;
  taskId: string | number;
  isVisible = false;
  isOkLoading = false;
  checkApproved: boolean;
  checkComment: string;
  principal: Principal;
  data: Organization;
  tplModal: NzModalRef;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.securityService.getPrincipal().subscribe((data: Principal) => {
      this.principal = data;
    });
    this.businessKey = this.activatedRoute.snapshot.params['businessKey'];
    this.taskId = this.activatedRoute.snapshot.params['taskId'];
    this.getDetail();
  }

  ngOnDestroy(): void {
    if (this.tplModal) {
      this.tplModal.close();
    }
  }

  getDetail() {
    this.organizationService.getOrganization(this.businessKey).subscribe((data: Organization) => {
      this.data = data;
    });
  }

  stakeholdersToString(): string {
    if (!this.data || !(this.data.stakeholders instanceof Array)) {
      return '';
    }
    return this.data.stakeholders.map(u => u.name).join(',');
  }

  getCurrent(flow: Flow): number {
    if (this.data.pass) {
      return 2;
    }
    switch (flow.taskDefinitionKey) {
      case 'administration_audit':
        return 1;
      case 'modifyApply':
        return 0;
    }
  }

  claim() {
    this.organizationService.claim(this.taskId).subscribe((data: Organization) => {
      this.message.create('success', '签收成功');
      this.data = data;
    });
  }

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

  download(id: number) {
    window.open(`${environment.SERVER_URL}/files/${id}`);
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

  /**
   * 是否能签收
   */
  isTaskAssignee(): boolean {
    if (this.taskId === '0' || this.taskId === 0) { // 不是任务进来的，就不能签收
      return false;
    }
    if (this.principal && this.principal.name && this.data && this.data.flows instanceof Array) {
      return this.data.flows.every(flow => flow.taskAssignee == null); // 只有在没有签收人的情况下才开放
    } else {
      return false;
    }
  }

  /**
   * 是否能审核
   */
  isCheck(): boolean {
    if (this.taskId === '0' || this.taskId === 0) { // 不是任务进来的，就不能签收
      return false;
    }
    if (this.principal && this.principal.name && this.data && this.data.flows instanceof Array) {
      const userId = Principal.getUserId(this.principal);
      return this.data.flows.find(flow => flow.taskAssignee === userId) ? true : false; // 只有在本人正是签收人的情况下才开放
    } else {
      return false;
    }
  }

  /**
   * 审核
   */
  check() {
    if (this.checkApproved == null) {
      return;
    }
    this.isOkLoading = true;
    this.organizationService.check(this.taskId, this.checkApproved, this.checkComment).subscribe(data => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.message.create('success', '已完成核对');
      this.router.navigate(['back/my-task']);
    }, err => {
      this.isVisible = false;
      this.isOkLoading = false;
      this.message.create('error', '操作失败');
      this.router.navigate(['back/my-task']);
    });
  }
}
