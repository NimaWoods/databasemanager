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
