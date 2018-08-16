import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Organization } from '../entities';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-organization-detail',
  templateUrl: './my-organization-detail.component.html',
  styleUrls: ['./my-organization-detail.component.css']
})
export class MyOrganizationDetailComponent implements OnInit {
  id: number;
  current = 0;
  data: Organization;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private organizationService: OrganizationService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getDetail();
  }

  getDetail() {
    this.organizationService.getDetail(this.id).subscribe((data: Organization) => {
      this.data = data;
      console.log(data);
        if (data.pass) {
          this.current = 2;
        } else if (data.flow.taskDefinitionKey) {
          if ('administration_audit' === data.flow.taskDefinitionKey) {
            if (!data.flow.taskAssignee) {
              this.current = 0;
            } else {
              this.current = 1;
            }
          }
        }
    });
  }

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

}
