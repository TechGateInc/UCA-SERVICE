import { Module } from '@nestjs/common';
import { UserdeviceService } from './userdevice.service';
import { UserdeviceController } from './userdevice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDevice, UserDeviceSchema } from './schema/userdevice.schema';
import { StudentModule } from 'src/student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDevice.name, schema: UserDeviceSchema },
    ]),
    StudentModule,
  ],
  providers: [UserdeviceService],
  controllers: [UserdeviceController],
})
export class UserdeviceModule {}
