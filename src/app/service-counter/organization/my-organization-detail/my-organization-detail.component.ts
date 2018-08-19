import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Flow, Principal } from '../../../shared/entities';

@Component({
  selector: 'app-my-organization-detail',
  templateUrl: './my-organization-detail.component.html',
  styleUrls: ['./my-organization-detail.component.css']
})
export class MyOrganizationDetailComponent implements OnInit {
  id: number;
  principal: Principal;
  flow: Flow; // 是否处于流程中的标识
  data: Organization;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.securityService.getPrincipal().subscribe((principal: Principal) => this.principal = principal);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getDetail();
  }

  getDetail() {
    this.organizationService.getDetail(this.id).subscribe((data: Organization) => {
      this.data = data;
      if (data.flows instanceof Array) {
        this.flow = data.flows.find(flow => flow.taskId != null);
      }
    });
  }

  getCurrent(flow: Flow) {
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

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

  showInvalid(): boolean {
    if (!this.flow || !this.principal) {
      return false;
    }
    return this.flow.applyUserId === this.principal.name.split(':')[0];
  }

  invalid() {
    this.modalService.confirm({
      nzTitle  : '<i>你确定要取消检查吗?</i>',
      nzContent: '<b>取消后，此注册信息不能使用！</b>',
      nzOnOk   : () => {
        this.organizationService.check(this.flow.taskId, false, '').subscribe(data => {
          this.router.navigate(['/service/organization/list']);
        });
      }
    });
  }
}
