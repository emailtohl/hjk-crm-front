import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from '../../../shared/security.service';
import { map, catchError } from 'rxjs/operators';
import { debouncedAsyncValidator } from '../../../shared/debouncedAsyncValidator';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { OrganizationService } from '../../../model-interface/organization.service';
import { Organization } from '../../../model-interface/entities';

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.css']
})
export class OrganizationEditComponent implements OnInit {
  id: number;
  validateForm: FormGroup;
  ignoreTaxNumber: string;
  ignoreAccount: string;
  uploadUrl = `${environment.SERVER_URL}/files`;
  fileList = [];
  previewImage = '';
  previewVisible = false;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private router: Router,
    private securityService: SecurityService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.validateForm = this.fb.group({
      id: [this.id, [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      taxNumber: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        if (v === this.ignoreTaxNumber) {
          return of(null);
        }
        return this.organizationService.isTaxNumberExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      depositBank: ['', [Validators.required]],
      account: ['', [Validators.required], [debouncedAsyncValidator<string>(v => {
        if (v === this.ignoreAccount) {
          return of(null);
        }
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
    this.organizationService.getDetail(this.id).subscribe((data: Organization) => {
      this.ignoreTaxNumber = data.taxNumber;
      this.ignoreAccount = data.account;
      this.validateForm.patchValue({
        name: data.name,
        address: data.address,
        telephone: data.telephone,
        taxNumber: data.taxNumber,
        depositBank: data.depositBank,
        account: data.account,
        principal: data.principal,
        principalPhone: data.principalPhone,
        deliveryAddress: data.deliveryAddress,
        remark: data.remark,
        receiver: data.receiver
      });
    });
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  removeFile = (file: UploadFile): (boolean | Observable<boolean>) => {
    if (file.response instanceof Array) {
      for (const resp of file.response) {
        return this.organizationService.deleteFile(resp.id).pipe(
          map(r => {
            return true;
          }),
          catchError(err => {
            this.message.create('warning', '该文件删除失败');
            return of(false);
          })
        );
      }
    } else {
      this.message.create('warning', '该文件删除失败');
      return false;
    }
  }

  submitForm = ($event, value) => {
    const credentials = [];
    for (const files of this.fileList) {
      if (files.response instanceof Array) {
        for (const file of files.response) {
          credentials.push({id: file.id});
        }
      }
    }
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    const copy = JSON.parse(JSON.stringify(value));
    copy.credentials = credentials;
    this.isLoading = true;
    this.organizationService.update(this.id, copy).subscribe(data => {
      this.message.create('success', '公司信息修改成功！');
      this.isLoading = false;
      this.router.navigate(['/back/organization/list']);
    }, err => this.isLoading = false);
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
