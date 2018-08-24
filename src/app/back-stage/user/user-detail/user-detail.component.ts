import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { User } from '../../../model-interface/entities';
import { SecurityService } from '../../../shared/security.service';
import { Principal } from '../../../shared/entities';
import { UserService } from '../../../model-interface/user.service';
import { InitData } from '../../../shared/init.data';

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
  listOfOption = InitData.getGroups();
  listOfSelectedValue = [];
  groupMap = new Map();

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    for (const g of this.listOfOption) {
      this.groupMap.set(g.id, g.name);
    }
    this.groupMap.set('ADMIN', '管理员');
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

  showGroups(groups: Array<string>): string {
    if (!(groups instanceof Array)) {
      return '';
    }
    return groups.map(groupId => this.groupMap.get(groupId)).join(',');
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
    if (Principal.getUserGroups(this.principal).has('ADMIN')) {
      this.message.create('warning', '不能将管理员账号禁用了');
      return;
    }
    this.userService.enable(this.data.id, false).subscribe(data => {
      this.data.enabled = false;
      this.message.create('success', '该账号已禁用');
    });
  }

  selectGroups(): void {
    this.userService.setGroupIds(Number.parseInt(Principal.getUserId(this.principal)), this.listOfSelectedValue)
    .subscribe(data => {
      this.message.create('success', '设置成功');
      this.isVisible = false;
    }, err => {
      this.isVisible = false;
      this.message.create('error', '设置失败');
    });
  }
}
