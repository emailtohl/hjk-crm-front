import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-my-organization-list',
  templateUrl: './my-organization-list.component.html',
  styleUrls: ['./my-organization-list.component.css']
})
export class MyOrganizationListComponent implements OnInit {
  list: Array<any>;
  constructor(private organizationService: OrganizationService) { }

  ngOnInit() {
    this.organizationService.myRegisterOrganization().subscribe(data => {
      this.list = data;
      console.log(data);
    });
  }

}
