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
import { Group, Csrf } from '../shared/dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  groups: Array<Group> = [];
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      group: [null, [Validators.required]],
      name: [null],
      cellPhonePrefix: ['+86'],
      cellPhone: [null],
      // captcha: [null, [Validators.required]],
      // agree: [false]
    });
    this.httpClient.get(`${Config.backend}/csrf`).subscribe((data: Csrf) => {
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
    this.httpClient.post(`${Config.backend}/users`, this.validateForm.value).subscribe(data => {
      // this.router.navigate();
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
