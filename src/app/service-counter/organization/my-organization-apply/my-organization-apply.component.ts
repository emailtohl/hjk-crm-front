import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../../../shared/security.service';
import { map, catchError } from 'rxjs/operators';
import { debouncedAsyncValidator } from '../../../shared/debouncedAsyncValidator';
import { OrganizationService } from '../organization.service';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-my-organization-apply',
  templateUrl: './my-organization-apply.component.html',
  styleUrls: ['./my-organization-apply.component.css']
})
export class MyOrganizationApplyComponent implements OnInit {
  validateForm: FormGroup;
  uploadUrl = `${environment.SERVER_URL}/files`;
  fileList = [];
  previewImage = '';
  previewVisible = false;

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
    this.organizationService.create(copy).subscribe(data => {
      this.message.create('success', '公司信息注册成功，等我们检查后，方可使用！');
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
