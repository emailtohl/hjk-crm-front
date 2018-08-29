import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Principal } from '../shared/entities';
import { SecurityService } from '../shared/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private securityService: SecurityService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const email = this.validateForm.value.email;
    const password = this.validateForm.value.password;

    this.isLoading = true;
    this.securityService.login(email, password).subscribe((resp: Principal) => {
      if (resp.authorities.length > 1 // 若有多个角色，那么肯定是内部人员
        || (resp.authorities.length === 1 && resp.authorities[0].authority !== 'CUSTOMER')) {
        this.router.navigate(['back']);
      } else {
        this.router.navigate(['service']);
      }
      this.isLoading = false;
    }, err => {
      // console.log(err);
      if (err.error && err.error.error === 'Not Found') {
        this.router.navigate(['login']);
      } else {
        this.message.create('error', `登录失败，请重试`);
        this.securityService.refresh();
      }
      this.isLoading = false;
    });
  }
}
