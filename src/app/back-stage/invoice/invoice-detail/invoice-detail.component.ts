import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../../../shared/security.service';
import { InvoiceService } from '../../../model-interface/invoice.service';
import { Invoice } from '../../../model-interface/entities';
import { Principal } from '../../../shared/entities';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  id: number;
  taskId: string | number;
  data: Invoice;
  isOkLoading = false;
  checkApproved: boolean;
  checkComment: string;
  principal: Principal = new Principal();
  tplModal: NzModalRef;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
    private message: NzMessageService,
    private modalService: NzModalService,
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['businessKey'];
    this.taskId = this.activatedRoute.snapshot.params['taskId'];
    this.securityService.refresh();
    this.securityService.getPrincipal().subscribe((data: Principal) => {
      this.principal = data;
    });
    this.getDetail();
  }

  getDetail() {
    this.invoiceService.getDetail(this.id).subscribe((data: Invoice) => {
      this.data = data;
      console.log(data);
    });
  }

  userUrl(id: string): string {
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }

  getCurrent() {
    if (!this.data || !this.data.flow) {
      return 0;
    }
    if (this.data.flow.pass != null) {
      return 3;
    }
    switch (this.data.flow.taskDefinitionKey) {
      case 'finance_handle':
        return 1;
      case 'foreign_handle':
        return 2;
    }
  }

  /**
   * 是否能签收
   */
  isTaskAssignee(): boolean {
    if (this.taskId === '0' || this.taskId === 0) { // 不是任务进来的，就不能签收
      return false;
    }
    if (this.principal && this.principal.name && this.data && this.data.flow) {
      return this.data.flow.taskAssignee == null; // 只有在没有签收人的情况下才开放
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
    if (this.principal && this.principal.name && this.data && this.data.flow) {
      const userId = Principal.getUserId(this.principal);
      return this.data.flow.taskAssignee === userId ? true : false; // 只有在本人正是签收人的情况下才开放
    } else {
      return false;
    }
  }

  claim() {
    this.invoiceService.claim(this.taskId).subscribe((data: Invoice) => {
      this.message.create('success', '签收成功');
      this.data = data;
      console.log(data);
    });
  }

  /**
   * 转到审核界面
   */
  goCheck() {
    if (this.data.flow) {
      switch (this.data.flow.taskDefinitionKey) {
        case 'finance_handle':
          this.router.navigate(['back/invoice/finance_handle/businessKey', this.data.id, 'taskId', this.taskId]);
          break;
        case 'foreign_handle':
          this.router.navigate(['back/invoice/foreign_handle/businessKey', this.data.id, 'taskId', this.taskId]);
          break;
      }
    }
  }

}
