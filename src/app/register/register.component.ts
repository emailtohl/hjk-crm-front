import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config';
import { Group, Csrf, User } from '../shared/dto';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  groups: Array<Group> = [];
  validateForm: FormGroup;
  csrf: Csrf;

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private router: Router, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      groups: [[], [Validators.required]],
      name: [null],
      cellPhonePrefix: ['+86'],
      cellPhone: [null],
      // captcha: [null, [Validators.required]],
      // agree: [false]
    });
    this.httpClient.get(`${Config.backend}/csrf`).subscribe((data: Csrf) => {
      this.csrf = data;
      this.validateForm.addControl(data.parameterName, new FormControl(data.token, Validators.required));
    });
    this.httpClient.get(`${Config.backend}/groups`).subscribe((data: Array<Group>) => {
      this.groups = data;
    });
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.httpClient.post(`${Config.backend}/users`, this.validateForm.value, {
      headers: { [this.csrf.headerName]: this.csrf.token }
    }).subscribe((data: User) => {
      console.log(data);
      const b = data.groups.every(g => g.id === 'CUSTOMER');
      if (b) {
        this.router.navigate(['service']);
      } else {
        this.router.navigate(['back']);
      }
    }, err => {
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
