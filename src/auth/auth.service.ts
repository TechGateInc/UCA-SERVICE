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
    @InjectModel(Student.name) private userModel: Model<Student>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(signUpDto: StudentSignUpDto): Promise<{ access_token: string }> {
    const { firstName, lastName, otherName, idNo, email, password, phoneNo } =
      signUpDto;

    const user = await this.userModel.findOne({ email: email });
    if (user) {
      throw new BadRequestException(
        'Student with this email already exists, please sign in',
      );
    }

    const hash = await argon.hash(password);

    const newUser = await this.userModel.create({
      firstName,
      lastName,
      otherName,
      idNo,
      email,
      password: hash,
      phoneNo,
    });
    return this.signToken(newUser._id, newUser.email);
  }

  async login(loginDto: StudentLoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('Invalid email ');
    }

    const isPasswordMatched = await argon.verify(user.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or passowrd');
    }
    return this.signToken(user._id, user.email);
  }

  async signToken(
    studentId: any,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      studentId: studentId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
