import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../../../shared/security.service';
import { map } from 'rxjs/operators';
import { debouncedAsyncValidator } from '../../../shared/debouncedAsyncValidator';
import { OrganizationService } from '../organization.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-my-organization-apply',
  templateUrl: './my-organization-apply.component.html',
  styleUrls: ['./my-organization-apply.component.css']
})
export class MyOrganizationApplyComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private securityService: SecurityService,
    private message: NzMessageService
  ) {
    this.securityService.refresh();
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      taxNumber: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        return this.organizationService.isTaxNumberExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      depositBank: ['', [Validators.required]],
      account: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        return this.organizationService.isAccountExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      principal: ['', [Validators.required]],
      principalPhone: ['', [Validators.required]],
      deliveryAddress: [''],
      remark: [''],
      receiver: [''],
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
    this.organizationService.create(value).subscribe(data => {
      this.message.create('success', '请等待审批成功后再生效！');
      this.router.navigate(['/service/organization/list']);
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
