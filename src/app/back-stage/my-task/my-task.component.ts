import { Component, OnInit } from '@angular/core';
import { TaskService } from './task.service';
import { Flow } from './entities';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.css']
})
export class MyTaskComponent implements OnInit {
  todoTasks: Array<Flow> = [];

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.todoTasks().subscribe((data: Array<Flow>) => {
      this.todoTasks = data;
      console.log(data);
    });
  }

}
