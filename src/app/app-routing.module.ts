import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirereportviewerComponent } from './firereportviewer/firereportviewer.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'report', component: ReportComponent},
  {path: 'reportsviewer', component: FirereportviewerComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
