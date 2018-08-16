import { Component, OnInit } from '@angular/core';
import { Flow } from './entities';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  todoTasks: Array<Flow> = [];
  flowTypeMap = new Map().set('ORGANIZATION', '检查公司信息').set('INVOICE', '开票');

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpClient.get<Array<Flow>>(`${environment.SERVER_URL}/todoTasks`).subscribe((data: Array<Flow>) => {
      this.todoTasks = data;
      console.log(data);
    });
  }

  getDetail(processInstanceId: string, taskId: string, type: string): void {
    switch (type) {
      case 'ORGANIZATION':
        this.router.navigate([`/back/organization/detail/processInstanceId`, processInstanceId, 'taskId', taskId]);
        break;

    }
  }
}
