import { Injectable } from '@angular/core';
import {LogLevel} from '@angular/compiler-cli';

declare global {
  interface Window {
    electronAPI: {
      writeLog: (msg: string) => void;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private logs: string[] = [];

  addLog(message: string, level: LogLevel): void {
    const logFunction = console[level as unknown as keyof Console] as (...args: any[]) => void;
    if (typeof logFunction === 'function') {
      logFunction(message);
    } else {
      console.log(message);}

    const formattedLevel = `[${level}]`;
    const entry = `${new Date().toISOString()} - ${formattedLevel} ${message}`;
    this.logs.push(entry);

    window.electronAPI?.writeLog(entry);
  }

  getLogs(): string[] {
    return this.logs;
  }
}
