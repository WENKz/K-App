import { Component, OnInit } from '@angular/core';
//import { TaskService } from '../../_services';
//import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../_models';

@Component({
  templateUrl: './kommission-view.component.html',
})

export class KommissionViewComponent implements OnInit {

  task: Task = new Task();

  constructor(
    /*private taskService: TaskService,
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router*/
  ) {}

  ngOnInit(): void {
  }
}
