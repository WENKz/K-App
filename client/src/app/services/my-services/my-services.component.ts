import {Component, OnInit} from '@angular/core';
import { BarmanService, ToasterService, AuthService, ServiceService } from '../../_services';
import { Moment } from 'moment';
import { Service, ConnectedUser } from '../../_models';

@Component({
    selector: 'app-my-services',
    templateUrl: './my-services.component.html',
})

export class MyServicesComponent implements OnInit {

    myServices: Service[];
    user: ConnectedUser;

    constructor(private authService: AuthService,
        private barmanService: BarmanService,
        private serviceService: ServiceService,
        private toasterService: ToasterService) {
    }

    ngOnInit() {
        this.authService.$currentUser.subscribe((user: ConnectedUser) => {
            this.user = user;
            if (this.user.barman) {
                this.serviceService.getWeek().subscribe(week => {
                    this.barmanService.getServices(this.user.barman.id, week.start, week.end).subscribe(services => {
                        if (services.length > 0) {
                            this.myServices = services;
                        } else {
                            this.myServices = undefined;
                        }
                    });
                });
            }
        });
    }
}
