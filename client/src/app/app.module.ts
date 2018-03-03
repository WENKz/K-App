import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MAT_DATETIME_FORMATS
  } from '@mat-datetimepicker/core';

// Routes
import { routing } from './app.routing';

// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { MembersListComponent } from './members/list/members-list.component';
import { MemberNewComponent } from './members/new/member-new.component';
import { MemberEditComponent } from './members/edit/member-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyServicesComponent } from './services/my-services/my-services.component';
import { PlanningComponent } from './services/planning/planning.component';
import { PlanMyServicesComponent } from './services/plan-my-services/plan-my-services.component';
import { BarmenListComponent } from './barmen/list/barmen-list.component';
import { BarmanNewComponent } from './barmen/new/barman-new.component';
import { BarmanViewComponent } from './barmen/view/barman-view.component';
import { BarmanEditComponent } from './barmen/edit/barman-edit.component';
import { KommissionsListComponent } from './kommissions/list/kommissions-list.component';
import { KommissionNewComponent } from './kommissions/new/kommission-new.component';
import { KommissionEditComponent } from './kommissions/edit/kommission-edit.component';
import { RolesListComponent } from './roles/list/roles-list.component';
import { RoleNewComponent } from './roles/new/role-new.component';
import { RoleEditComponent } from './roles/edit/role-edit.component';
import { CodeDialogComponent } from './code-dialog/code-dialog.component';
import { NotFoundComponent } from './404/not-found.component';
import { ConnectedUserDialogComponent } from './connected-user-dialog/connected-user-dialog.component';
import { OpenServicesComponent } from './services/open-services/open-services.component';
import { WeekPickerComponent } from './services/week-picker/week-picker.component';

// Services
import { ToasterService, LoginService, MemberService,
    BarmanService, ServiceService, KommissionService, RoleService,
    TemplateService } from './_services/index';

// Guards
import { AuthGuard } from './_guards/auth.guard';

// Helpers
import { JwtInterceptor } from './_helpers/jwt.interceptor';

// Date

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

// Modules
import { MaterialModule } from './_helpers/material.module';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        LoginComponent,
        MenuComponent,
        MembersListComponent,
        MemberNewComponent,
        MemberEditComponent,
        DashboardComponent,
        MyServicesComponent,
        PlanningComponent,
        PlanMyServicesComponent,
        BarmenListComponent,
        BarmanNewComponent,
        BarmanViewComponent,
        BarmanEditComponent,
        KommissionEditComponent,
        KommissionNewComponent,
        KommissionsListComponent,
        RoleEditComponent,
        RoleNewComponent,
        RolesListComponent,
        CodeDialogComponent,
        NotFoundComponent,
        ConnectedUserDialogComponent,
        OpenServicesComponent,
        WeekPickerComponent
    ],
    entryComponents: [
        CodeDialogComponent,
        ConnectedUserDialogComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDatetimeModule,
        MatDatetimepickerModule
    ],
    bootstrap: [AppComponent],
    providers: [
        LoginService,
        MemberService,
        BarmanService,
        ServiceService,
        KommissionService,
        RoleService,
        AuthGuard,
        ToasterService,
        TemplateService,
        {
            provide: LOCALE_ID, useValue: 'fr'
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ]
})
export class AppModule { }
