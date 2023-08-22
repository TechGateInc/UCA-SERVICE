import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private readonly config: ConfigService) {}

  getConnectionString() {
    const connectionString = this.config.get('MONGODB_URI');
    if (!connectionString) {
      throw new Error(
        'No connection string has been provided in the .env file.',
      );
    }
    return connectionString;
  }
}
