import {Component} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ConnectionService, PostgresConnection} from '../../../services/ConnectionService';

@Component({
  selector: 'connection-list',
  templateUrl: './connection-list.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor], // falls du standalone nutzt
})
export class ConnectionListComponent {
  connections: PostgresConnection[] = [];
  selectedConnection?: PostgresConnection;

  private connectionService = new ConnectionService();

  constructor() {
    this.loadConnections();
  }

  loadConnections() {
    this.connections = this.connectionService.getAllConnections();
  }

  editConnection(conn: PostgresConnection) {
    this.selectedConnection = structuredClone(conn);
  }

  saveConnection() {
    if (this.selectedConnection) {
      this.connectionService.saveConnection(this.selectedConnection);
      this.loadConnections();
      this.selectedConnection = undefined;
    }
  }

  deleteConnection(name: string) {
    this.connectionService.deleteConnection(name);
    this.loadConnections();
  }

  cancelEdit() {
    this.selectedConnection = undefined;
  }
}
