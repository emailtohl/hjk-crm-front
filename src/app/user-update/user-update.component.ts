import { Component, OnInit, Input } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { environment } from '../../environments/environment';
import { SecurityService } from '../shared/security.service';
import { debouncedAsyncValidator } from '../shared/debouncedAsyncValidator';
import { map } from 'rxjs/operators';
import { User } from '../model-interface/entities';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  @Input()
  id: number;
  uploadPicture;
  passwordForm: FormGroup;
  profileForm: FormGroup;
  ignoreEmail: string;
  ignoreCellPhone: string;
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.securityService.refresh();
    this.profileForm = this.fb.group({
      id: [this.id, [Validators.required]],
      email: [null, [Validators.required, Validators.email], [debouncedAsyncValidator((v: string) => {
        if (v === this.ignoreEmail) {
          return of(null);
        }
        return this.securityService.emailIsExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      name: [null],
      cellPhonePrefix: ['+86'],
      cellPhone: [null, [this.cellPhoneValidator], [debouncedAsyncValidator((v: string) => {
        if (v === this.ignoreCellPhone) {
          return of(null);
        }
        return this.securityService.cellPhoneIsExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      birthday: [null, [this.birthdayValidator]],
      gender: ['UNSPECIFIED', []],
    });
    this.uploadPicture = `${environment.SERVER_URL}/users/uploadPicture/${this.id}?d=${new Date().getTime()}`;
    this.passwordForm = this.fb.group({
      id: [this.id, [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirm: ['', [this.confirmValidator]],
    });

    this.securityService.getProfile(this.id).subscribe((data: User) => {
      this.ignoreEmail = data.email;
      this.ignoreCellPhone = data.cellPhone;
      this.profileForm.patchValue({
        email: data.email,
        name: data.name,
        cellPhone: data.cellPhone,
        birthday: data.birthday,
        gender: data.gender,
      });
    });
  }

  submitProfileForm($event, value): void {
    for (const i in this.profileForm.controls) {
      if (this.profileForm.controls.hasOwnProperty(i)) {
        this.profileForm.controls[i].markAsDirty();
        this.profileForm.controls[i].updateValueAndValidity();
      }
    }
    this.isLoading = true;
    this.securityService.updateProfile(this.id, this.profileForm.value)
    .subscribe((data: User) => {
      this.isLoading = false;
      this.message.success('已成功修改个人资料，下次登录后刷新信息');
      this.modal.destroy({ type: 'profile', result: true });
    }, err => {
      this.isLoading = false;
      this.message.error('个人资料修改失败');
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.profileForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.profileForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  cellPhoneValidator = (control: FormControl): { [s: string]: boolean | null } => {
    if (!control.value || /^1[0-9]{10}$/.test(control.value)) {
      return null;
    } else {
      return { cellPhone: true, error: true };
    }
  }

  birthdayValidator = (control: FormControl): { [s: string]: boolean | null } => {
    if (!control.value || new Date().getFullYear() - control.value.getFullYear() > 0) {
      return null;
    } else {
      return { birthday: true, error: true };
    }
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  submitPasswordForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.passwordForm.controls) {
      if (this.passwordForm.controls.hasOwnProperty(key)) {
        this.passwordForm.controls[key].markAsDirty();
        this.passwordForm.controls[key].updateValueAndValidity();
      }
    }
    const form = {
      id: this.passwordForm.value.id,
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    };
    this.isLoading = true;
    this.securityService.updateMyPassword(form).subscribe(data => {
      this.isLoading = false;
      this.message.success('已成功修改密码，下次登录请用新密码');
      this.modal.destroy({ type: 'password', result: true });
    }, err => {
      this.isLoading = false;
      this.message.error('修改失败，有可能修改的不是本人的密码，也可能是原密码不对');
    });
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.passwordForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.passwordForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
  }

  handleChange(event) {
    console.log(event);
    if (event.type === 'success') {
      this.message.success('上传成功，刷新后可更新头像');
      this.uploadPicture = `${environment.SERVER_URL}/users/uploadPicture/${this.id}?d=${new Date().getTime()}`;
    }
  }

  back() {
    this.modal.destroy({ type: '', result: false });
  }
}
