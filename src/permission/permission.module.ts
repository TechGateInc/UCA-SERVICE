import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schema/permission.schema';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    StaffModule,
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
