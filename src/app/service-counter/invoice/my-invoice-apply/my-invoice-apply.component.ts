import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { InvoiceService } from '../invoice.service';
import { Router } from '@angular/router';
import { SecurityService } from '../../../shared/security.service';
import { map } from 'rxjs/operators';
import { debouncedAsyncValidator } from '../../../shared/debouncedAsyncValidator';

@Component({
  selector: 'app-my-invoice-apply',
  templateUrl: './my-invoice-apply.component.html',
  styleUrls: ['./my-invoice-apply.component.css']
})
export class MyInvoiceApplyComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
    private securityService: SecurityService,
  ) {
    this.securityService.refresh();
    this.validateForm = this.fb.group({
      organization: ['', [Validators.required]],
      organizationAddress: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      taxNumber: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        return this.invoiceService.isTaxNumberExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      depositBank: ['', [Validators.required]],
      account: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        return this.invoiceService.isAccountExist(v).pipe(
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
    this.invoiceService.create(value).subscribe(data => {
      this.router.navigate(['/service/invoice/list']);
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
