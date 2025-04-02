import * as fs from 'fs';
import * as path from 'path';
import {PostgresConnection} from '../interfaces/PostgresConnection';

const DEFAULT_CONNECTION: Partial<PostgresConnection> = {
  port: 5432,
  isProductive: false,
  isOnlyDumps: false,
};

export class ConnectionService {
  private filePath: string;

  constructor(filename: string = 'connections.json') {
    this.filePath = path.resolve(__dirname, filename);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]');
    }
  }

  private readConnections(): PostgresConnection[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeConnections(connections: PostgresConnection[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(connections, null, 2));
  }

  public getAllConnections(): PostgresConnection[] {
    return this.readConnections();
  }

  public saveConnection(connection: Partial<PostgresConnection> & { name: string }): void {
    const connections = this.readConnections();
    const existingIndex = connections.findIndex(c => c.name === connection.name);

    const fullConnection: PostgresConnection = {
      host: connection.host || 'localhost',
      port: connection.port ?? DEFAULT_CONNECTION.port!,
      user: connection.user || 'postgres',
      password: connection.password || '',
      database: connection.database || '',
      isProductive: connection.isProductive ?? DEFAULT_CONNECTION.isProductive!,
      isOnlyDumps: connection.isOnlyDumps ?? DEFAULT_CONNECTION.isOnlyDumps!,
      name: connection.name,
    };

    if (existingIndex >= 0) {
      connections[existingIndex] = fullConnection;
    } else {
      connections.push(fullConnection);
    }

    this.writeConnections(connections);
  }

  public deleteConnection(name: string): void {
    const connections = this.readConnections().filter(c => c.name !== name);
    this.writeConnections(connections);
  }
}
