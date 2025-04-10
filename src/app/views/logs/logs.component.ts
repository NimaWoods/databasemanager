import {Component, OnInit} from '@angular/core';
import {LogService} from '../../services/LogService';

@Component({
  selector: 'app-logs',
  imports: [],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})

export class LogsComponent implements OnInit {

  logs: string[] = [];

  constructor(private logService: LogService) {
  }

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.logs = this.logService.getLogs();
  }
}
