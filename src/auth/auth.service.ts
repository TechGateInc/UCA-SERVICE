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

import { Student } from 'src/student/schema/student.schema';
import { LecturerSignUpDto, StudentLoginDto, StudentSignUpDto } from './dto';
import { Request, Response } from 'express';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { Lecturer } from 'src/lecturer/schema/lecturer.schema';
import { LecturerLoginDto } from './dto/lecturer-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Lecturer.name) private lecturerModel: Model<Lecturer>,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly activityLogService: ActivityLogService,
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

    const role = 'student';

    const tokenPair = await this.signTokens(role, newUser._id, newUser.email);

    await this.saveRefreshToken(role, newUser._id, tokenPair.refresh_token);

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

    // Log the action
    await this.activityLogService.createActivityLog(
      newUser._id,
      'New Student Created',
    );

    return {
      access_token: tokenPair.access_token,
      user,
      message: 'Student registered successfully',
    };
  }
  async lecturerSignUp(
    signUpDto: LecturerSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
    const { firstName, lastName, otherName, idNo, email, password, phoneNo } =
      signUpDto;

    const student = await this.lecturerModel.findOne({ email: email });
    if (student) {
      throw new BadRequestException(
        'Student with this email already exists, please sign in',
      );
    }

    const hash = await argon.hash(password);

    const newUser = await this.lecturerModel.create({
      firstName,
      lastName,
      otherName,
      idNo,
      email,
      password: hash,
      phoneNo,
    });

    const role = 'lecturer';

    const tokenPair = await this.signTokens(role, newUser._id, newUser.email);

    // Save the refresh token in the database
    await this.saveRefreshToken(role, newUser._id, tokenPair.refresh_token);

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

    // Log the action
    await this.activityLogService.createActivityLog(
      newUser._id,
      'New Lecturer Created',
    );

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

    const role = 'student';
    const tokenPair = await this.signTokens(role, student._id, student.email);
    // Save the new refresh token in the database
    await this.saveRefreshToken(role, student._id, tokenPair.refresh_token);

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

    await this.activityLogService.createActivityLog(
      student._id,
      'Student Login',
    );

    return {
      access_token: tokenPair.access_token,
      user,
    };
  }

  async lecturerLogin(
    loginDto: LecturerLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    const { email, password } = loginDto;

    const lecturer = await this.lecturerModel.findOne({ email: email });

    if (!lecturer) {
      throw new UnauthorizedException('Invalid email ');
    }

    const isPasswordMatched = await argon.verify(lecturer.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or passowrd');
    }
    delete lecturer.password;
    const role = 'lecturer';
    const tokenPair = await this.signTokens(role, lecturer._id, lecturer.email);
    // Save the new refresh token in the database
    await this.saveRefreshToken(role, lecturer._id, tokenPair.refresh_token);

    // Set the refresh token as a HttpOnly cookie
    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true, // Set this to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const user = {
      name: `${lecturer.firstName} ${lecturer.lastName}`,
      email: lecturer.email,
      id: lecturer._id,
      idNo: lecturer.idNo,
    };

    await this.activityLogService.createActivityLog(
      lecturer._id,
      'Lecturer Login',
    );

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

    const role = decoded.role;

    let isValidRefreshToken = false;
    switch (role) {
      case 'student':
        isValidRefreshToken = await this.validateStudentRefreshToken(
          decoded.studentId,
          refreshToken,
        );
        break;
      case 'lecturer':
        isValidRefreshToken = await this.validateLecturerRefreshToken(
          decoded.lecturerId,
          refreshToken,
        );
        break;
        // case 'admin':
        //   isValidRefreshToken = await this.validateAdminRefreshToken(
        //     decoded.adminId,
        //     refreshToken,
        //   );
        break;
    }

    if (!isValidRefreshToken) {
      await this.clearRefreshToken(role, decoded.id);
      response.clearCookie('refresh_token');
    }

    switch (role) {
      case 'student':
        decoded.id = decoded.studentId;
        break;
      case 'lecturer':
        decoded.id = decoded.lecturerId;
        break;
    }
    console.log(decoded.id);

    const tokenPair = await this.signTokens(role, decoded.id, decoded.email);

    await this.saveRefreshToken(role, decoded.id, tokenPair.refresh_token);

    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      access_token: tokenPair.access_token,
    };
  }

  async clearRefreshToken(role: string, userId: string): Promise<void> {
    switch (role) {
      case 'student':
        await this.studentModel.findByIdAndUpdate(userId, {
          refreshToken: null,
        });
        break;
      case 'lecturer':
        await this.lecturerModel.findByIdAndUpdate(userId, {
          refreshToken: null,
        });
        break;
      // case 'admin':
      //   await this.adminModel.findByIdAndUpdate(userId, {
      //     refreshToken: null,
      //   });
      //   break;
    }
  }

  async saveRefreshToken(
    role: string,
    userId: any,
    refreshToken: string,
  ): Promise<void> {
    switch (role) {
      case 'student':
        await this.studentModel.findByIdAndUpdate(userId, { refreshToken });
        break;
      case 'lecturer':
        await this.lecturerModel.findByIdAndUpdate(userId, { refreshToken });
        break;
      // case 'admin':
      //   await this.adminModel.findByIdAndUpdate(userId, { refreshToken });
      //   break;
    }
  }

  async validateStudentRefreshToken(
    studentId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const student = await this.studentModel.findById(studentId);
    return student && student.refreshToken === refreshToken;
  }

  async validateLecturerRefreshToken(
    lecturerId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const lecturer = await this.lecturerModel.findById(lecturerId);
    return lecturer && lecturer.refreshToken === refreshToken;
  }

  // async validateAdminRefreshToken(
  //   adminId: string,
  //   refreshToken: string,
  // ): Promise<boolean> {
  //   const admin = await this.adminModel.findById(adminId);
  //   return admin && admin.refreshToken === refreshToken;
  // }

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
    role: string,
    userId: any,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessPayload = {
      [`${role}Id`]: userId,
      email,
      role,
    };

    const refreshPayload = {
      [`${role}Id`]: userId,
      email,
      isRefreshToken: true,
      role,
    };

    const accessSecret = this.config.get('JWT_ACCESS_SECRET');
    const refreshSecret = this.config.get('JWT_REFRESH_SECRET');

    const access_token = this.jwtService.sign(accessPayload, {
      expiresIn: '3m',
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
