import {
  BadRequestException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

import { Student } from '../student/schema/student.schema';
import { StudentLoginDto, StudentSignUpDto } from './dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(
    signUpDto: StudentSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
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

    const tokenPair = await this.signTokens(newUser._id, newUser.email);

    // Save the refresh token in the database
    await this.saveRefreshToken(newUser._id, tokenPair.refresh_token);

    // Set the refresh token as a HttpOnly cookie
    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true, // Set this to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const user = {
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      id: newUser._id,
      idNo: newUser.idNo,
    };

    return {
      access_token: tokenPair.access_token,
      user,
      message: 'Student registered successfully',
    };
  }

  async login(
    loginDto: StudentLoginDto,
    @Res({ passthrough: true }) response: Response,
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
    delete student.password;
    const tokenPair = await this.signTokens(student._id, student.email);
    // Save the new refresh token in the database
    await this.saveRefreshToken(student._id, tokenPair.refresh_token);

    // Set the refresh token as a HttpOnly cookie
    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true, // Set this to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const user = {
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      id: student._id,
      idNo: student.idNo,
    };

    return {
      access_token: tokenPair.access_token,
      user,
    };
  }

  async refreshTokens(
    refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    // Validate the refresh token against the stored value in the database
    const isValidRefreshToken = await this.validateRefreshToken(
      decoded.studentId,
      refreshToken,
    );

    if (!isValidRefreshToken) {
      // Clear the refresh token from the database
      await this.clearRefreshToken(decoded.studentId);

      // Clear the refresh token cookie
      response.clearCookie('refresh_token');
    }

    const tokenPair = await this.signTokens(decoded.studentId, decoded.email);

    // Save the new refresh token in the database
    await this.saveRefreshToken(decoded.studentId, tokenPair.refresh_token);

    // Set the new refresh token as a HttpOnly cookie
    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: tokenPair.access_token,
    };
  }

  async clearRefreshToken(studentId: string): Promise<void> {
    await this.studentModel.findByIdAndUpdate(studentId, {
      refreshToken: null,
    });
  }

  async saveRefreshToken(studentId: any, refreshToken: string): Promise<void> {
    await this.studentModel.findByIdAndUpdate(studentId, { refreshToken });
  }

  async validateRefreshToken(
    studentId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const student = await this.studentModel.findById(studentId);
    return student && student.refreshToken === refreshToken;
  }

  decodeRefreshTokenFromRequest(request: Request): any | null {
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      return null;
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      return decoded;
    } catch (error) {
      return null;
    }
  }

  async signTokens(
    studentId: any,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessPayload = {
      studentId,
      email,
    };

    const refreshPayload = {
      studentId,
      email,
      isRefreshToken: true,
    };

    const accessSecret = this.config.get('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

    const access_token = this.jwtService.sign(accessPayload, {
      expiresIn: '1m',
      secret: accessSecret,
    });

    const refresh_token = this.jwtService.sign(refreshPayload, {
      expiresIn: '5d',
      secret: refreshSecret,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
