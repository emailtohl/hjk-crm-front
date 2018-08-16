import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Principal } from '../shared/entities';
import { InitData } from '../shared/init.data';
import { SecurityService } from '../shared/security.service';

@Component({
  selector: 'app-back-stage',
  templateUrl: './back-stage.component.html',
  styleUrls: ['./back-stage.component.css']
})
export class BackStageComponent implements OnInit {
  principal: Principal = new Principal();
  allGroups: Set<string>;
  isCollapsed = false;
  isReverseArrow = false;
  width = 200;

  constructor(securityService: SecurityService) {
    securityService.getPrincipal().subscribe((principal: Principal) => this.principal = principal);
    this.allGroups = new Set(InitData.getGroups().map(g => g.id));
    this.allGroups.add('ADMIN');
    console.log(this.principal);
    console.log(this.allGroups);
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
