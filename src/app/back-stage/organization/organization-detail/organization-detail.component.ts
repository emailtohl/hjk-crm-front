import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Principal, Flow } from '../../../shared/entities';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent implements OnInit, OnDestroy {
  processInstanceId: string;
  taskId: string;
  principal: Principal;
  data: Organization;
  confirmModal: NzModalRef;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.securityService.getPrincipal().subscribe((data: Principal) => {
      this.principal = data;
    });
    this.processInstanceId = this.activatedRoute.snapshot.params['processInstanceId'];
    this.taskId = this.activatedRoute.snapshot.params['taskId'];
    this.getDetail();
  }

  ngOnDestroy(): void {
    if (this.confirmModal) {
      this.confirmModal.close();
    }
  }

  getDetail() {
    this.organizationService.getByProcessInstanceId(this.processInstanceId).subscribe((data: Organization) => {
      this.data = data;
    });
  }

  getCurrent(flow: Flow) {
    if (this.data.pass) {
      return 2;
    } else if (flow.taskDefinitionKey) {
      if ('administration_audit' === flow.taskDefinitionKey) {
        if (!flow.taskAssignee) {
          return 0;
        } else {
          return 1;
        }
      }
    }
  }

  claim() {
    this.organizationService.claim(this.taskId).subscribe((data: Organization) => {
      this.message.create('success', '签收成功');
      this.data = data;
      console.log(data);
    });
  }

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

  isTaskAssignee(): boolean {
    if (this.principal && this.principal.name && this.data && this.data.flows instanceof Array) {
      const userId = this.principal.name.split(':')[0];
      return this.data.flows.every(flow => flow.taskAssignee === userId);
    } else {
      return false;
    }
  }

  check() {
    this.confirmModal = this.modal.confirm({
      nzTitle: '输入你的审核意见',
      nzContent: `
      <form>
        <nz-radio-group [(ngModel)]="radioValue">
        <label nz-radio nzValue="true">同意</label>
          <label nz-radio nzValue="false">不同意</label>
        </nz-radio-group>
        意见：
        <textarea nz-input placeholder="Autosize height with minimum and maximum number of lines" [nzAutosize]="{ minRows: 2, maxRows: 6 }">
        </textarea>
      </form>
      `,
      nzOnOk: () => new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
      }).catch(() => console.log('Oops errors!'))
    });
  }
}
