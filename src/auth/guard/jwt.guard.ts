import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtStudentAuthGuard extends AuthGuard('jwt-student') {}

@Injectable()
export class JwtLecturerAuthGuard extends AuthGuard('jwt-lecturer') {}

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt-admin') {}
