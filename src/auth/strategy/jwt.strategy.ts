import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Admin } from 'src/admin/schema/admin.schema';
import { Staff } from 'src/staff/schema/staff.schema';

import { Student } from 'src/student/schema/student.schema';
// import { Admin } from 'src/admin/schema/admin.schema';

@Injectable()
export class JwtStudentStrategy extends PassportStrategy(
  Strategy,
  'jwt-student',
) {
  constructor(
    private configService: ConfigService,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    studentId: any;
    email: string;
    firstName: string;
    role: 'student';
  }) {
    const student = await this.studentModel.findById(payload.studentId);
    if (!student) {
      return Promise.reject(
        new UnauthorizedException('Login First to access this endpoint'),
      );
    }
    return payload;
  }
}

@Injectable()
export class JwtStaffStrategy extends PassportStrategy(Strategy, 'jwt-staff') {
  constructor(
    private configService: ConfigService,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    staffId: any;
    email: string;
    firstName: string;
    role: 'staff';
  }) {
    const staff = await this.staffModel.findById(payload.staffId);
    if (!staff) {
      return Promise.reject(
        new UnauthorizedException('Login First to access this endpoint'),
      );
    }
    return payload;
  }
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private configService: ConfigService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    adminId: any;
    email: string;
    firstName: string;
    role: 'admin';
  }) {
    const admin = await this.adminModel.findById(payload.adminId);
    if (!admin) {
      return Promise.reject(
        new UnauthorizedException('Login First to access this endpoint'),
      );
    }
    return payload;
  }
}
