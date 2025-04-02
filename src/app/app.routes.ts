import { Routes } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {createComponent} from '@angular/core';
import {CreateDatabaseComponent} from './views/create-database/create-database.component';
import {DumpComponent} from './views/dump/dump.component';
import {RestoreComponent} from './views/restore/restore.component';
import {LogsComponent} from './views/logs/logs.component';
import {SettingsComponent} from './views/settings/settings.component';
import {AppComponent} from './app.component';
import {ManageConnectionsComponent} from './views/manage-connections/manage-connections.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'manage', component: ManageConnectionsComponent },
  { path: 'create', component: CreateDatabaseComponent },
  { path: 'dump', component: DumpComponent },
  { path: 'restore', component: RestoreComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'settings', component: SettingsComponent },
];
