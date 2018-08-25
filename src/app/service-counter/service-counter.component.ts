import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Principal } from '../shared/entities';
import { SecurityService } from '../shared/security.service';
import { InitData } from '../shared/init.data';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { UpdateMyPasswordComponent } from '../shared/update-my-password/update-my-password.component';

@Component({
  selector: 'app-service-counter',
  templateUrl: './service-counter.component.html',
  styleUrls: ['./service-counter.component.css']
})
export class ServiceCounterComponent implements OnInit {
  isCollapsed = false;
  principal: Principal = new Principal();
  icon: string;
  allGroups: Set<string>;
  isEmployee = false;

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService
  ) {
  }

  ngOnInit() {
    this.securityService.getPrincipal().subscribe((principal: Principal) => {
      this.principal = principal;
      const id = this.principal.name.split(':')[0];
      this.icon = `${environment.SERVER_URL}/users/userPicture/${id}`;
      this.isEmployee = principal.authorities.every(value => this.allGroups.has(value.authority) || this.allGroups.has(value));
    });
    this.allGroups = new Set(InitData.getGroups().map(g => g.id));
    this.allGroups.add('ADMIN');
    this.allGroups.delete('CUSTOMER');
  }

  logout() {
    this.securityService.logout().subscribe(data => {
      this.router.navigate(['login']);
      this.securityService.refresh();
    });
  }

  openUpdateMyPasswordModal() {
    const modal = this.modalService.create({
      nzTitle: '修改密码',
      nzContent: UpdateMyPasswordComponent,
      nzComponentParams: {
        id: Principal.getUserId(this.principal),
      },
      nzFooter: null
    });
  }
}
