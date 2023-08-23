import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStudentStrategy, JwtLecturerStrategy } from './strategy';
import { Student, StudentSchema } from '../student/schema/student.schema';
import { Lecturer, LecturerSchema } from '../lecturer/schema/lecturer.schema';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

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
    MongooseModule.forFeature([
      { name: Lecturer.name, schema: LecturerSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtLecturerStrategy, JwtStudentStrategy],
  exports: [JwtLecturerStrategy, JwtStudentStrategy, PassportModule],
})
export class AuthModule {}
