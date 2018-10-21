import { MaterialModule } from './material/material.module';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';

import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdditionalinfoComponent } from './additionalinfo/additionalinfo.component';
import { HoldableDirective } from './holdable.directive';
import { FirereportviewerComponent } from './firereportviewer/firereportviewer.component';
import { LoginComponent } from './login/login.component';

declare const google: any;

@NgModule({
  declarations: [
    AppComponent,
    ReportComponent,
    HomeComponent,
    AdditionalinfoComponent,
    HoldableDirective,
    FirereportviewerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: environment.firebase.apiKey,
      libraries: ["places"]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
