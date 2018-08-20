import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../../../shared/security.service';
import { InvoiceService } from '../../../model-interface/invoice.service';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-my-invoice-apply',
  templateUrl: './my-invoice-apply.component.html',
  styleUrls: ['./my-invoice-apply.component.css']
})
export class MyInvoiceApplyComponent implements OnInit {
  organizations: Array<Organization> = [];
  validateForm: FormGroup;
  isLoading = false;

  constructor(
    securityService: SecurityService,
    organizationService: OrganizationService,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
    private message: NzMessageService
  ) {
    securityService.refresh();
    organizationService.myRegisterOrganization().subscribe((data: Array<Organization>) => {
      this.organizations = data.filter(organization => organization.pass);
    });
    this.validateForm = this.fb.group({
      organization: this.fb.group({id: ['', [Validators.required]]}),
      type: ['', [Validators.required]],
      remark: [''],
    });
  }

  ngOnInit(): void {
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
    this.invoiceService.start(value).subscribe(data => {
      this.isLoading = false;
      this.message.create('success', '创建成功');
      this.router.navigate(['/service/invoice/list']);
    }, err => {
      this.isLoading = false;
      this.message.create('error', '创建失败');
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

}
