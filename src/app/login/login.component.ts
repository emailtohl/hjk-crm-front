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
import { Csrf } from '../shared/dto';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  csrf: Csrf;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    this.http.get(`${environment.SERVER_URL}/csrf`).subscribe((data: Csrf) => {
      this.csrf = data;
      this.validateForm.addControl(data.parameterName, new FormControl(data.token, Validators.required));
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
    const body = `email=${email}&password=${password}&${this.csrf.parameterName}=${this.csrf.token}`;
    this.http.post(url, body, { headers: headers }).subscribe(resp => {
      this.router.navigate(['service']);
    }, err => {
      // console.log(err);
      if (err.error && err.error.error === 'Not Found') {
        this.router.navigate(['login']);
      } else {
        this.message.create('error', `登录失败`);
      }
    });
  }
}
