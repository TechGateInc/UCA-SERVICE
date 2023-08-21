import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

import { Student } from 'src/student/schema/student.schema';
import { StudentLoginDto, StudentSignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(
    signUpDto: StudentSignUpDto,
  ): Promise<{ access_token: string; user: object; message: string }> {
    const { firstName, lastName, otherName, idNo, email, password, phoneNo } =
      signUpDto;

    const student = await this.studentModel.findOne({ email: email });
    if (student) {
      throw new BadRequestException(
        'Student with this email already exists, please sign in',
      );
    }

    const hash = await argon.hash(password);

    const newUser = await this.studentModel.create({
      firstName,
      lastName,
      otherName,
      idNo,
      email,
      password: hash,
      phoneNo,
    });

    const token = await this.signToken(newUser._id, newUser.email);

    const user = {
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      id: newUser._id,
      idNo: newUser.idNo,
    };

    return {
      access_token: token,
      user,
      message: 'Student registered successfully',
    };
  }

  async login(
    loginDto: StudentLoginDto,
  ): Promise<{ access_token: string; user: object }> {
    const { email, password } = loginDto;

    const student = await this.studentModel.findOne({ email: email });

    if (!student) {
      throw new UnauthorizedException('Invalid email ');
    }

    const isPasswordMatched = await argon.verify(student.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or passowrd');
    }
    const token = await this.signToken(student._id, student.email);
    delete student.password;

    const user = {
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      id: student._id,
      idNo: student.idNo,
    };

    return { access_token: token, user };
  }

  signToken(studentId: any, email: string): Promise<string> {
    const payload = {
      studentId: studentId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    return this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });
  }
}
