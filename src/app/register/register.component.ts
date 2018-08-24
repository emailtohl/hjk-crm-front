import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { InitData } from '../shared/init.data';
import { debouncedAsyncValidator } from '../shared/debouncedAsyncValidator';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Group, User } from '../model-interface/entities';


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
    private httpClient: HttpClient,
    private router: Router,
    private message: NzMessageService,
  ) {
    this.groups = InitData.getGroups();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email], [debouncedAsyncValidator(v => {
        return this.httpClient.get<boolean>(`${environment.SERVER_URL}/users/isEmailExist?email=${v}`).pipe(
          map((b: boolean) => b ? { error: true, duplicated: true } : null),
        );
      })]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      group: ['CUSTOMER', [Validators.required]],
      groups: [[]],
      name: [null],
      cellPhonePrefix: ['+86'],
      cellPhone: [null, [], [debouncedAsyncValidator(v => {
        return this.httpClient.get<boolean>(`${environment.SERVER_URL}/users/isCellPhoneExist?cellPhone=${v}`).pipe(
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
    this.httpClient.post(`${environment.SERVER_URL}/users`, this.validateForm.value)
    .subscribe((data: User) => {
      this.isLoading = false;
      this.message.create('success', '账号注册成功');
      if (data.groups.has('CUSTOMER')) {
        this.router.navigate(['service']);
      } else {
        this.router.navigate(['back']);
      }
    }, err => {
      this.isLoading = false;
      this.message.create('error', `注册失败`);
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

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

}
