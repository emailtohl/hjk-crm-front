import { Component, OnInit, Input } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { SecurityService } from '../security.service';
import { Principal } from '../entities';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-update-my-password',
  templateUrl: './update-my-password.component.html',
  styleUrls: ['./update-my-password.component.css']
})
export class UpdateMyPasswordComponent implements OnInit {
  @Input()
  id: number;
  validateForm: FormGroup;
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private securityService: SecurityService,
    private message: NzMessageService
  ) {
  }

  ngOnInit() {
    this.securityService.refresh();
    this.validateForm = this.fb.group({
      id: [this.id, [Validators.required]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirm: ['', [this.confirmValidator]],
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
    const form = {
      id: this.validateForm.value.id,
      oldPassword: this.validateForm.value.oldPassword,
      newPassword: this.validateForm.value.newPassword,
    };
    this.isLoading = true;
    this.securityService.updateMyPassword(form).subscribe(data => {
      this.isLoading = false;
      this.message.create('success', '修改成功');
      this.modal.destroy({'success': '修改成功'});
    }, err => {
      this.isLoading = false;
      this.message.create('error', '修改失败，有可能修改的不是本人的密码，也可能是原密码不对');
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
    this.validateForm.patchValue({id: this.id});
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
  }

}
