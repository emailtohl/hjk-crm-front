import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Flow } from '../../../back-stage/my-task/entities';

@Component({
  selector: 'app-my-organization-detail',
  templateUrl: './my-organization-detail.component.html',
  styleUrls: ['./my-organization-detail.component.css']
})
export class MyOrganizationDetailComponent implements OnInit {
  id: number;
  data: Organization;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getDetail();
  }

  getDetail() {
    this.organizationService.getDetail(this.id).subscribe((data: Organization) => {
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

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

}
