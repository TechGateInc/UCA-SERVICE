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
import { StaffSignUpDto, StudentLoginDto, StudentSignUpDto } from './dto';
import { Request, Response } from 'express';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { Staff } from 'src/staff/schema/staff.schema';
import { StaffLoginDto } from './dto/staff-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
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
    const { firstName, lastName, otherName, idNo, email, password } = signUpDto;

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
  async staffSignUp(
    signUpDto: StaffSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
    const { firstName, lastName, idNo, email, password } = signUpDto;

    const staff = await this.staffModel.findOne({ email: email });
    if (staff) {
      throw new BadRequestException(
        'Staff with this email already exists, please sign in',
      );
    }

    const hash = await argon.hash(password);

    const newUser = await this.staffModel.create({
      firstName,
      lastName,
      idNo,
      email,
      password: hash,
      permissions: ['64edbd06c36943f88221d457'],
    });

    const role = 'staff';

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
      'New Staff Created',
    );

    return {
      access_token: tokenPair.access_token,
      user,
      message: 'Staff registered successfully',
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

  async staffLogin(
    loginDto: StaffLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    const { email, password } = loginDto;

    const staff = await this.staffModel
      .findOne({ email: email })
      .populate('permissions');

    if (!staff) {
      throw new UnauthorizedException('Invalid email ');
    }

    const isPasswordMatched = await argon.verify(staff.password, password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or passowrd');
    }
    const permissionNames = staff.permissions.map(
      (permission) => permission.name,
    );

    delete staff.password;
    const role = 'staff';
    const tokenPair = await this.signTokens(
      role,
      staff._id,
      staff.email,
      permissionNames,
    );
    // Save the new refresh token in the database
    await this.saveRefreshToken(role, staff._id, tokenPair.refresh_token);

    // Set the refresh token as a HttpOnly cookie
    response.cookie('refresh_token', tokenPair.refresh_token, {
      httpOnly: true,
      secure: true, // Set this to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const user = {
      name: `${staff.firstName} ${staff.lastName}`,
      email: staff.email,
      id: staff._id,
      idNo: staff.idNo,
      permission: staff.permissions,
    };

    await this.activityLogService.createActivityLog(staff._id, 'Staff Login');

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
      case 'staff':
        isValidRefreshToken = await this.validateStaffRefreshToken(
          decoded.staffId,
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
      case 'staff':
        decoded.id = decoded.staffId;
        break;
    }

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
      case 'staff':
        await this.staffModel.findByIdAndUpdate(userId, {
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
      case 'staff':
        await this.staffModel.findByIdAndUpdate(userId, { refreshToken });
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

  async validateStaffRefreshToken(
    staffId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const staff = await this.staffModel.findById(staffId);
    return staff && staff.refreshToken === refreshToken;
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
    permissions?: string[],
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessPayload = {
      [`${role}Id`]: userId,
      email,
      role,
      permissions,
    };

    const refreshPayload = {
      [`${role}Id`]: userId,
      email,
      isRefreshToken: true,
      role,
      permissions,
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
