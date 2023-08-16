import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentSchema } from './schema/student.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MailerService } from 'src/mail/mail.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService, MailerService],
})
export class StudentModule {}
