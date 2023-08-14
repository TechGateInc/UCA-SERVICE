import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { Student } from 'src/student/schema/student.schema';

@Injectable()
export class JwTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: {
    studentId: any;
    email: string;
    firstName: string;
  }) {
    const student = this.studentModel.findById({ _id: payload.studentId });
    if (!student) {
      throw new UnauthorizedException('Login First to access this endpoint');
    }
    // delete (await student).password
    return payload;
  }
}
