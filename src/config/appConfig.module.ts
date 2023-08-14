import { AppConfig } from './app.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  exports: [AppConfig],
  imports: [ConfigModule.forRoot()],
  providers: [AppConfig],
})
export class AppConfigurationModule {}
