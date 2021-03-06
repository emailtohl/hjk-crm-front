import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { InitData } from '../shared/init.data';
import { debouncedAsyncValidator } from '../shared/debouncedAsyncValidator';
import { map } from 'rxjs/operators';
import { Group, User } from '../model-interface/entities';
import { SecurityService } from '../shared/security.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;
  groups: Group[];

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private router: Router,
    private message: NzMessageService,
  ) {
    this.groups = InitData.getGroups();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email], [debouncedAsyncValidator((v: string) => {
        return this.securityService.emailIsExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      group: ['CUSTOMER', [Validators.required]],
      groups: [[]],
      name: [null],
      cellPhonePrefix: ['+86'],
      cellPhone: [null, [this.cellPhoneValidator], [debouncedAsyncValidator((v: string) => {
        return this.securityService.cellPhoneIsExist(v).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      // captcha: [null, [Validators.required]],
      // agree: [false]
    });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const group = this.validateForm.controls.group.value;
    this.validateForm.controls.groups.setValue([group]);
    this.isLoading = true;
    this.securityService.register(this.validateForm.value)
    .subscribe((data: User) => {
      this.isLoading = false;
      this.message.create('success', '账号注册成功');
      if (data.groups.includes('CUSTOMER')) {
        this.router.navigate(['service']);
      } else {
        this.router.navigate(['back']);
      }
    }, err => {
      this.isLoading = false;
      this.message.create('error', `注册失败，请重试`);
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
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

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

}
