import { Component, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ConnectionService} from '../../../services/ConnectionService';
import {PostgresConnection} from '../../../interfaces/PostgresConnection';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'connection-list',
  templateUrl: './connection-list.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./connection-list.component.scss']
})
export class ConnectionListComponent implements OnInit {
  connections: PostgresConnection[] = [];
  selectedConnection?: PostgresConnection;

  constructor(private connectionService: ConnectionService) {}

  ngOnInit(): void {
    this.connections = this.connectionService.getAllConnections();
  }

  editConnection(conn: PostgresConnection): void {
    this.selectedConnection = { ...conn };
  }

  saveConnection(): void {
    if (this.selectedConnection) {
      this.connectionService.saveConnection(this.selectedConnection);
      this.connections = this.connectionService.getAllConnections();
      this.selectedConnection = undefined;
    }
  }

  cancelEdit(): void {
    this.selectedConnection = undefined;
  }

  deleteConnection(name: string): void {
    this.connectionService.deleteConnection(name);
    this.connections = this.connectionService.getAllConnections();
  }
}
