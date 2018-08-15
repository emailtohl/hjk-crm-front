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
    });
  }

  credentialUrl(id: string): string {
    return `${environment.SERVER_URL}/files/${id}`;
  }

}
