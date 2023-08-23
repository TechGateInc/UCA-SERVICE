import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { Student } from 'src/student/schema/student.schema';
import { Lecturer } from 'src/lecturer/schema/lecturer.schema';
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
      throw new UnauthorizedException('Login First to access this endpoint');
    }
    return payload;
  }
}

@Injectable()
export class JwtLecturerStrategy extends PassportStrategy(
  Strategy,
  'jwt-lecturer',
) {
  constructor(
    private configService: ConfigService,
    @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    lecturerId: any;
    email: string;
    firstName: string;
    role: 'lecturer';
  }) {
    const lecturer = await this.lecturerModel.findById(payload.lecturerId);
    if (!lecturer) {
      throw new UnauthorizedException('Login First to access this endpoint');
    }
    return payload;
  }
}

// @Injectable()
// export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
//   constructor(
//     private configService: ConfigService,
//     @InjectModel(Admin.name) private adminModel: Model<Admin>,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: configService.get('JWT_ACCESS_SECRET'),
//       ignoreExpiration: false,
//     });
//   }

//   async validate(payload: {
//     adminId: any;
//     email: string;
//     firstName: string;
//     role: 'admin';
//   }) {
//     const admin = await this.adminModel.findById(payload.adminId);
//     if (!admin) {
//       throw new UnauthorizedException('Login First to access this endpoint');
//     }
//     return payload;
//   }
// }
