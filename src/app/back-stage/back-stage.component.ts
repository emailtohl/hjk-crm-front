import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Principal } from '../shared/entities';
import { InitData } from '../shared/init.data';
import { SecurityService } from '../shared/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-stage',
  templateUrl: './back-stage.component.html',
  styleUrls: ['./back-stage.component.css']
})
export class BackStageComponent implements OnInit {
  isCollapsed = false;
  principal: Principal = new Principal();
  icon: string;
  allGroups: Set<string>;

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.securityService.getPrincipal().subscribe((principal: Principal) => {
      this.principal = principal;
      const id = this.principal.name.split(':')[0];
      this.icon = `${environment.SERVER_URL}/users/userPicture/${id}`;
    });
    this.allGroups = new Set(InitData.getGroups().map(g => g.id));
    this.allGroups.add('ADMIN');
  }

  isAdmin(): boolean {
    return Principal.getUserGroups(this.principal).has('ADMIN');
  }

  logout() {
    this.securityService.logout().subscribe(data => this.router.navigate(['login']));
  }
}
