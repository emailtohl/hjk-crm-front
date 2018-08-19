import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Principal, Csrf } from '../shared/entities';
import { environment } from '../../environments/environment';
import { InitData } from '../shared/init.data';
import { SecurityService } from '../shared/security.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService,
    private securityService: SecurityService,
  ) { }

  ngOnInit(): void {
    this.securityService.refresh();
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
    const url = `${environment.SERVER_URL}/login`;
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const email = this.validateForm.value.email;
    const password = this.validateForm.value.password;
    const body = `email=${email}&password=${password}&${SecurityService.csrf.parameterName}=${SecurityService.csrf.token}`;
    this.http.post(url, body, { headers: headers }).subscribe((resp: Principal) => {
      // 后台在登录后可能会切换sessionId
      this.securityService.refresh();

      if (resp.authorities.length > 1 // 若有多个角色，那么肯定是内部人员
        || (resp.authorities.length === 1 && resp.authorities[0].authority !== 'CUSTOMER')) {
        this.router.navigate(['back']);
      } else {
        this.router.navigate(['service']);
      }
    }, err => {
      // console.log(err);
      if (err.error && err.error.error === 'Not Found') {
        this.router.navigate(['login']);
      } else {
        this.message.create('error', `登录失败`);
        this.securityService.refresh();
      }
    });
  }
}
