import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Principal } from '../shared/entities';
import { SecurityService } from '../shared/security.service';
import { InitData } from '../shared/init.data';

@Component({
  selector: 'app-service-counter',
  templateUrl: './service-counter.component.html',
  styleUrls: ['./service-counter.component.css']
})
export class ServiceCounterComponent implements OnInit {
  isCollapsed = false;
  allGroups: Set<string>;
  principal: Principal;
  isEmployee = false;

  constructor(securityService: SecurityService) {
    securityService.getPrincipal().subscribe((principal: Principal) => {
      this.principal = principal;
      this.isEmployee = principal.authorities.every(value => this.allGroups.has(value.authority) || this.allGroups.has(value));
    });
    this.allGroups = new Set(InitData.getGroups().map(g => g.id));
    this.allGroups.add('ADMIN');
    this.allGroups.delete('CUSTOMER');
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
