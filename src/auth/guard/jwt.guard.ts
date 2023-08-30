import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtStudentAuthGuard extends AuthGuard('jwt-student') {}

@Injectable()
export class JwtStaffAuthGuard extends AuthGuard('jwt-staff') {}

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-admin') {}
