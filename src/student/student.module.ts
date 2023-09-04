import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentSchema } from './schema/student.schema';
import { AuthModule } from '../auth/auth.module';
import { MailerService } from '../mail/mail.service';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ActivityLogModule,
  ],
  controllers: [StudentController],
  providers: [StudentService, MailerService],
  exports: [StudentService],
})
export class StudentModule {}
