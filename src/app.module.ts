import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { UniversityModule } from './university/university.module';
import { AdminModule } from './admin/admin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { CourseModule } from './course/course.module';
import { TimetableModule } from './timetable/timetable.module';
import { DepartmentModule } from './department/department.module';
import { FacultyModule } from './faculty/faculty.module';
import { VenueModule } from './venue/venue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigurationModule } from './config';
import { MailerService } from './mail/mail.service';
import { MailerModule } from './mail/mail.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { StaffModule } from './staff/staff.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      useFactory: async (config: ConfigService) => {
        const uri = config.get('MONGODB_URI');
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UniversityModule,
    AdminModule,
    AttendanceModule,
    CourseModule,
    AuthModule,
    StudentModule,
    TimetableModule,
    DepartmentModule,
    ActivityLogModule,
    FacultyModule,
    VenueModule,
    MailerModule,
    StaffModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
