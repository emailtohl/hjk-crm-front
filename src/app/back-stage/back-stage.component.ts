import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message} from '@stomp/stompjs';
import {StompService} from '@stomp/ng2-stompjs';
import { environment } from '../../environments/environment';
import { Principal, PartialParams } from '../shared/entities';
import { InitData } from '../shared/init.data';
import { SecurityService } from '../shared/security.service';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Subscription, Observable } from 'rxjs';
import { UserUpdateComponent } from '../user-update/user-update.component';

@Component({
  selector: 'app-back-stage',
  templateUrl: './back-stage.component.html',
  styleUrls: ['./back-stage.component.css']
})
export class BackStageComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  principal: Principal = new Principal();
  icon: string;
  allGroups: Set<string>;
  // Stream of messages
  private subscription: Subscription;
  public messages$: Observable<Message>;

  constructor(
    private securityService: SecurityService,
    private router: Router,
    private modalService: NzModalService,
    private stompService: StompService,
    private notification: NzNotificationService
  ) {
  }

  ngOnInit() {
    this.securityService.getPrincipal().subscribe((principal: Principal) => {
      this.principal = principal;
      const id = this.principal.name.split(':')[0];
      this.icon = `${environment.SERVER_URL}/users/userPicture/${id}`;
      // Stream of messages
      this.messages$ = this.stompService.subscribe(`/topic/task/${id}`);
      // Subscribe a function to be run on_next message
      this.subscription = this.messages$.subscribe(this.on_next);
    });
    this.allGroups = new Set(InitData.getGroups().map(g => g.id));
    this.allGroups.add('ADMIN');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Consume a message from the _stompService */
  public on_next = (message: Message) => {
    // Log it to the console
    this.notification.info('任务提醒', message.body);
  }

  isAdmin(): boolean {
    return Principal.getUserGroups(this.principal).has('ADMIN');
  }

  logout() {
    this.securityService.logout().subscribe(data => {
      this.router.navigate(['login']);
      this.securityService.refresh();
    });
  }

  openModal() {
    const modal = this.modalService.create({
      nzTitle: '个人信息',
      nzContent: UserUpdateComponent,
      nzComponentParams: Principal.getUserPartialId(this.principal),
      nzFooter: null
    });
    modal.afterClose.subscribe((result) => console.log('[afterClose] The result is:', result));
  }
}
