import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffSchema } from './schema/staff.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [
    ActivityLogModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Staff', schema: StaffSchema }]),
  ],
  providers: [StaffService, MailerService],
  controllers: [StaffController],
  exports: [StaffService],
})
export class StaffModule {}
