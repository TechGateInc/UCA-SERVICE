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
import { Request, Response } from 'express';
import { createLogger, format, transports } from 'winston';

import { Student } from 'src/student/schema/student.schema';
import {
  AdminLoginDto,
  AdminSignUpDto,
  StaffSignUpDto,
  StudentLoginDto,
  StudentSignUpDto,
} from './dto';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import { Staff } from 'src/staff/schema/staff.schema';
import { StaffLoginDto } from './dto/staff-login.dto';
import { Admin } from 'src/admin/schema/admin.schema';
import { UserdeviceService } from 'src/userdevice/userdevice.service';

@Injectable()
export class AuthService {
  private readonly logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console(), // Console transport for logging to console
      new transports.File({ filename: 'logs/auth-service.log' }), // File transport for saving logs to a file
    ],
  });
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly activityLogService: ActivityLogService,
    private readonly userDeviceService: UserdeviceService,
  ) {}

  async signUp(
    signUpDto: StudentSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
    try {
      const { firstName, lastName, otherName, idNo, email, password } =
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
      this.logger.log({
        level: 'info',
        message: `Student registered successfully: ${user.email}`,
      });

      return {
        access_token: tokenPair.access_token,
        user,
        message: 'Student registered successfully',
      };
    } catch (error) {
      this.logger.error(`Error during student registration: ${error.message}`);
      throw error; // Re-throw the error to let the global error handler handle it
    }
  }

  async staffSignUp(
    signUpDto: StaffSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
    try {
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
      this.logger.log({
        level: 'info',
        message: `Staff registered successfully: ${user.email}`,
      });

      return {
        access_token: tokenPair.access_token,
        user,
        message: 'Staff registered successfully',
      };
    } catch (error) {
      this.logger.error(`Error during staff registration: ${error.message}`);
      throw error; // Re-throw the error to let the global error handler handle it
    }
  }

  async adminSignUp(
    signUpDto: AdminSignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    message: string;
  }> {
    try {
      const { firstName, lastName, email, password } = signUpDto;

      const staff = await this.adminModel.findOne({ email: email });
      if (staff) {
        throw new BadRequestException(
          'Admin with this email already exists, please sign in',
        );
      }

      const hash = await argon.hash(password);

      const newUser = await this.adminModel.create({
        firstName,
        lastName,
        email,
        password: hash,
      });

      const role = 'admin';

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
      };

      // Log the action
      this.logger.log({
        level: 'info',
        message: `Admin registered successfully: ${user.email}`,
      });

      return {
        access_token: tokenPair.access_token,
        user,
        message: 'Admin registered successfully',
      };
    } catch (error) {
      this.logger.error(`Error during admin registration: ${error.message}`);
      throw error; // Re-throw the error to let the global error handler handle it
    }
  }

  async login(
    loginDto: StudentLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    access_token: string;
    user: object;
    deviceRegistered: boolean;
  }> {
    try {
      const { email, password, deviceId } = loginDto;

      const student = await this.studentModel.findOne({ email: email });

      if (!student) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordMatched = await argon.verify(student.password, password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }
      delete student.password;

      const role = 'student';
      const tokenPair = await this.signTokens(role, student._id, student.email);
      await this.saveRefreshToken(role, student._id, tokenPair.refresh_token);

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

      const deviceCheckResult = await this.userDeviceService.checkDevice(
        student._id,
        deviceId,
      );

      // Check if the device belongs to the user
      if (deviceCheckResult) {
        // Update lastLogin in the user's device document
        const userDevice = deviceCheckResult;
        userDevice.lastLogin = new Date(); // Update lastLogin timestamp
        await userDevice.save(); // Save the updated userDevice
      }

      // Log the action
      this.logger.log({
        level: 'info',
        message: `Student logged in successfully: ${user.email}`,
      });

      // Continue with the login and return an indication of device registration status
      return {
        access_token: tokenPair.access_token,
        user,
        deviceRegistered: deviceCheckResult ? true : false,
      };
    } catch (error) {
      this.logger.error(`Error during student login: ${error.message}`);
      throw error;
    }
  }

  async staffLogin(
    loginDto: StaffLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    try {
      const { email, password } = loginDto;

      const staff = await this.staffModel
        .findOne({ email: email })
        .populate('permissions');

      if (!staff) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordMatched = await argon.verify(staff.password, password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
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
      await this.saveRefreshToken(role, staff._id, tokenPair.refresh_token);

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

      // Log the action
      this.logger.log({
        level: 'info',
        message: `Staff logged in successfully: ${user.email}`,
      });

      return {
        access_token: tokenPair.access_token,
        user,
      };
    } catch (error) {
      this.logger.error(`Error during staff login: ${error.message}`);
      throw error;
    }
  }

  async adminLogin(
    loginDto: AdminLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string; user: object }> {
    try {
      const { email, password } = loginDto;

      const admin = await this.adminModel
        .findOne({ email: email })
        .populate('permissions');

      if (!admin) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordMatched = await argon.verify(admin.password, password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid email or password');
      }

      delete admin.password;
      const role = 'admin';
      const tokenPair = await this.signTokens(role, admin._id, admin.email);
      await this.saveRefreshToken(role, admin._id, tokenPair.refresh_token);

      response.cookie('refresh_token', tokenPair.refresh_token, {
        httpOnly: true,
        secure: true, // Set this to true if using HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const user = {
        name: `${admin.firstName} ${admin.lastName}`,
        email: admin.email,
        id: admin._id,
      };

      await this.activityLogService.createActivityLog(admin._id, 'Admin Login');

      // Log the action
      this.logger.log({
        level: 'info',
        message: `Admin logged in successfully: ${user.email}`,
      });

      return {
        access_token: tokenPair.access_token,
        user,
      };
    } catch (error) {
      this.logger.error(`Error during admin login: ${error.message}`);
      throw error;
    }
  }

  async refreshTokens(
    refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    try {
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
        case 'admin':
          isValidRefreshToken = await this.validateAdminRefreshToken(
            decoded.adminId,
            refreshToken,
          );
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

      // Log the action
      this.logger.log({
        level: 'info',
        message: `Tokens refreshed successfully for user: ${decoded.email}`,
      });

      return {
        access_token: tokenPair.access_token,
      };
    } catch (error) {
      this.logger.error(`Error during token refresh: ${error.message}`);
      throw error;
    }
  }

  async clearRefreshToken(role: string, userId: string): Promise<void> {
    try {
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
        case 'admin':
          await this.adminModel.findByIdAndUpdate(userId, {
            refreshToken: null,
          });
          break;
      }
    } catch (error) {
      this.logger.error(`Error clearing refresh token: ${error.message}`);
      throw error;
    }
  }

  async saveRefreshToken(
    role: string,
    userId: any,
    refreshToken: string,
  ): Promise<void> {
    try {
      switch (role) {
        case 'student':
          await this.studentModel.findByIdAndUpdate(userId, { refreshToken });
          break;
        case 'staff':
          await this.staffModel.findByIdAndUpdate(userId, { refreshToken });
          break;
        case 'admin':
          await this.adminModel.findByIdAndUpdate(userId, { refreshToken });
          break;
      }
    } catch (error) {
      this.logger.error(`Error saving refresh token: ${error.message}`);
      throw error;
    }
  }

  async validateStudentRefreshToken(
    studentId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const student = await this.studentModel.findById(studentId);
      return student && student.refreshToken === refreshToken;
    } catch (error) {
      this.logger.error(
        `Error validating student refresh token: ${error.message}`,
      );
      throw error;
    }
  }

  async validateStaffRefreshToken(
    staffId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const staff = await this.staffModel.findById(staffId);
      return staff && staff.refreshToken === refreshToken;
    } catch (error) {
      this.logger.error(
        `Error validating staff refresh token: ${error.message}`,
      );
      throw error;
    }
  }

  async validateAdminRefreshToken(
    adminId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      const admin = await this.adminModel.findById(adminId);
      return admin && admin.refreshToken === refreshToken;
    } catch (error) {
      this.logger.error(
        `Error validating admin refresh token: ${error.message}`,
      );
      throw error;
    }
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
      this.logger.error(
        `Error decoding refresh token from request: ${error.message}`,
      );
      return null;
    }
  }

  async signTokens(
    role: string,
    userId: any,
    email: string,
    permissions?: string[],
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
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
    } catch (error) {
      this.logger.error(`Error signing tokens: ${error.message}`);
      throw error;
    }
  }
}
