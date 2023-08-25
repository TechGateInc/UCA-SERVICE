import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LecturerController } from './lecturer.controller';
import { AuthModule } from '../auth/auth.module';
import { MailerService } from '../mail/mail.service';
import { Lecturer, LecturerSchema } from './schema/lecturer.schema';
import { LecturerService } from './lecturer.service';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [
    AuthModule,
    ActivityLogModule,
    MongooseModule.forFeature([
      { name: Lecturer.name, schema: LecturerSchema },
    ]),
  ],
  providers: [LecturerService, MailerService],
  controllers: [LecturerController],
})
export class LecturerModule {}
