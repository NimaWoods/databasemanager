export interface PostgresConnection {
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  isProductive: boolean;
  isOnlyDumps: boolean;

  preferredFilename?: string;
  Schema?: string;
  excludeTables?: string[];
  includeBlobs?: boolean;
  includeDateSuffix?: boolean;
}

const STORAGE_KEY = 'db-connections';

export class ConnectionService {
  public getAllConnections(): PostgresConnection[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  public saveConnection(connection: PostgresConnection): void {
    const connections = this.getAllConnections();
    const index = connections.findIndex(c => c.name === connection.name);

    if (index >= 0) {
      connections[index] = connection;
    } else {
      connections.push(connection);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }

  public deleteConnection(name: string): void {
    const filtered = this.getAllConnections().filter(c => c.name !== name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}
