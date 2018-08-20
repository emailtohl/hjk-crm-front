import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../model-interface/User.service';
import { User } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Principal, Flow } from '../../../shared/entities';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  id: number;
  principal: Principal;
  data: User;
  isVisible = false;
  tplModal: NzModalRef;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.securityService.getPrincipal().subscribe((data: Principal) => {
      this.principal = data;
    });
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getDetail();
  }

  getDetail() {
    this.userService.getDetail(this.id).subscribe((data: User) => {
      this.data = data;
      console.log(data);
    });
  }

  isEnable(): boolean {
    if (!this.data) {
      return true;
    }
    if (this.data.enabled != null && this.data.enabled === false) {
      return false;
    }
    return true;
  }

  resetPassword(): void {
    this.userService.resetPassword(this.data.id).subscribe(data => {
      this.message.create('success', '密码重置成功');
    });
  }

  enable(): void {
    this.userService.enable(this.data.id, true).subscribe(data => {
      this.data.enabled = true;
      this.message.create('success', '该账号已启用');
    });
  }

  disable(): void {
    this.userService.enable(this.data.id, false).subscribe(data => {
      this.data.enabled = false;
      this.message.create('success', '该账号已禁用');
    });
  }
}
