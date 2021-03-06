import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { SecurityService } from '../../../../shared/security.service';
import { InvoiceService } from '../../../../model-interface/invoice.service';
import { Principal } from '../../../../shared/entities';

@Component({
  selector: 'app-foreign-handle',
  templateUrl: './foreign-handle.component.html',
  styleUrls: ['./foreign-handle.component.css']
})
export class ForeignHandleComponent implements OnInit {
  id: number;
  taskId: string;
  principal: Principal = new Principal();
  validateForm: FormGroup;
  tplModal: NzModalRef;
  tplModalButtonLoading = false;
  checkComment = '';
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
      invoiceNumber: [null, [Validators.required]],
      ticketTime: [null, [Validators.required]],
      content: [null, [Validators.required]],
      expressTime: [null],
      expressCompany: [null],
      expressNumber: [null],
      expressFee: [null, [this.numberValidator]],
      paymentOn: [null, [this.numberValidator]],
      remark: [null],
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

  openAbortModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.tplModal = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true,
    });
  }

  abort() {
    this.tplModalButtonLoading = true;
    this.invoiceService.check(this.taskId, false, this.checkComment, {}).subscribe(data => {
      this.tplModalButtonLoading = false;
      this.message.create('success', '提交成功');
      this.tplModal.close();
      this.backToMyTaskList();
    }, err => {
      this.tplModalButtonLoading = false;
      this.tplModal.close();
      this.message.create('error', '提交失败');
    });
  }

  cancelAbort() {
    if (this.tplModal) {
      this.tplModal.close();
    }
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
    this.invoiceService.check(this.taskId, true, '', value).subscribe(data => {
      this.isLoading = false;
      this.message.create('success', '提交成功');
      this.backToMyTaskList();
    }, err => {
      this.isLoading = false;
      this.message.create('error', '提交失败');
    });
  }

}
