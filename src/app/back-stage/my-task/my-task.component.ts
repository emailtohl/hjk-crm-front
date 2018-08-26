import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Flow } from '../../model-interface/entities';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  todoTasks: Array<Flow> = [];
  displayTodoTasks: Array<Flow> = [];
  flowTypeMap = new Map().set('ORGANIZATION', '检查公司信息').set('INVOICE', '开票');
  searchValue = '';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.httpClient.get<Array<Flow>>(`${environment.SERVER_URL}/todoTasks`).subscribe((data: Array<Flow>) => {
      this.todoTasks = data;
      this.displayTodoTasks = [...data];
    });
  }

  getDetail(businessKey: string, taskId: string, type: string): void {
    switch (type) {
      case 'ORGANIZATION':
        this.router.navigate([`/back/organization/detail/businessKey`, businessKey, 'taskId', taskId]);
        break;
        case 'INVOICE':
        this.router.navigate([`/back/invoice/detail/businessKey`, businessKey, 'taskId', taskId]);
    }
  }

  search() {
    if (!this.searchValue) {
      this.displayTodoTasks = [...this.todoTasks];
    } else {
      this.displayTodoTasks = this.todoTasks.filter(item => item.flowNum.toUpperCase().includes(this.searchValue.toUpperCase()));
    }
  }
}
