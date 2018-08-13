import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared/dto';
import { InitData } from '../shared/init.data';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-service-counter',
  templateUrl: './service-counter.component.html',
  styleUrls: ['./service-counter.component.css']
})
export class ServiceCounterComponent implements OnInit {
  isCollapsed = false;
  principal: Principal = InitData.principal;

  constructor() {
  }

  ngOnInit() {
  }

  getUserPicture(): string {
    if (!this.principal) {
      return '';
    }
    const id = this.principal.name.split(':')[0];
    return `${environment.SERVER_URL}/users/userPicture/${id}`;
  }
}
