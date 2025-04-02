import { Component } from '@angular/core';
import {ConnectionListComponent} from './connection-list/connection-list.component';

@Component({
  selector: 'app-manage-connections',
  imports: [
    ConnectionListComponent
  ],
  templateUrl: './manage-connections.component.html',
  styleUrl: './manage-connections.component.scss'
})
export class ManageConnectionsComponent {

}
