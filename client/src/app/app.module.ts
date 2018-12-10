import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { NavMenuComponent } from './layout/nav-menu/nav-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PresentationComponent } from './presentation/presentation.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';

import { AppRoutingModule } from './app-routing.module';

// Load moment french locale
import 'moment/locale/fr';
import * as moment from 'moment';

moment.locale('fr');

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LoaderComponent,
    NavMenuComponent,
    NotFoundComponent,
    PresentationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    // Eager load HomeModule
    HomeModule,
    NgxPermissionsModule.forRoot(),
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
