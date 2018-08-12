import { Component, OnInit } from '@angular/core';
import { Principal } from '../shared/dto';
import { InitData } from '../shared/init.data';

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

}
