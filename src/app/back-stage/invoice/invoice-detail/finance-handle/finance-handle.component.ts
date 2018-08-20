import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../../shared/security.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { InvoiceService } from '../../../../model-interface/invoice.service';
import { Principal } from '../../../../shared/entities';

@Component({
  selector: 'app-finance-handle',
  templateUrl: './finance-handle.component.html',
  styleUrls: ['./finance-handle.component.css']
})
export class FinanceHandleComponent implements OnInit {
  id: number;
  taskId: string;
  principal: Principal = new Principal();
  validateForm: FormGroup;
  isLoading = false;
  numberPattern = /^[\d\-]+(\.\d+)?$/;

  constructor(
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
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
    this.validateForm = this.fb.group({
      income: [null, [Validators.required, this.numberValidator]],
      receiveTime: [null, [Validators.required]],
      ticketfee: [null, [Validators.required, this.numberValidator]],
      tax: [null, [this.numberValidator]],
      deduct: [null, [this.numberValidator]],
      detail: [null],
    });
  }

  numberValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return null;
    } else if (!this.numberPattern.test(control.value)) {
      return { notNumber: true, error: true };
    }
  }

  backToDetail() {
    this.router.navigate(['/back/invoice/detail/businessKey', this.id, 'taskId', this.taskId]);
  }

  backToMyTaskList() {
    this.router.navigate(['/back/my-task']);
  }

  abort() {
    this.modalService.confirm({
      nzTitle: '警告！',
      nzContent: '<b style="color: red;">请确认是否终止该申请！</b>',
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.invoiceService.check(this.taskId, false, {}).subscribe(data => {
          this.isLoading = false;
          this.message.create('success', '提交成功');
          this.backToMyTaskList();
        }, err => {
          this.isLoading = false;
          this.message.create('error', '提交失败');
        });
      },
      nzCancelText: '否',
      nzOnCancel: () => {}
    });
  }

  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.isLoading = true;
    this.invoiceService.check(this.taskId, true, value).subscribe(data => {
      this.isLoading = false;
      this.message.create('success', '提交成功');
      this.backToMyTaskList();
    }, err => {
      this.isLoading = false;
      this.message.create('error', '提交失败');
    });
  }
}
