import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './schema/admin.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    ActivityLogModule,
  ],
  providers: [AdminService, MailerService],
  controllers: [AdminController],
})
export class AdminModule {}
