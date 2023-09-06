import { Module } from '@nestjs/common';
import { UserdeviceService } from './userdevice.service';
import { UserdeviceController } from './userdevice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDevice, UserDeviceSchema } from './schema/userdevice.schema';
import { StudentModule } from 'src/student/student.module';
import { Student, StudentSchema } from 'src/student/schema/student.schema';
import { JwtStudentStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema },
    ]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    StudentModule,
  ],
  providers: [UserdeviceService, JwtStudentStrategy],
  controllers: [UserdeviceController],
})
export class UserdeviceModule {}
