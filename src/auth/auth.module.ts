import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStudentStrategy, JwtStaffStrategy } from './strategy';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { Staff, StaffSchema } from 'src/staff/schema/staff.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ActivityLogModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStaffStrategy, JwtStudentStrategy],
  exports: [JwtStaffStrategy, JwtStudentStrategy, PassportModule],
})
export class AuthModule {}
