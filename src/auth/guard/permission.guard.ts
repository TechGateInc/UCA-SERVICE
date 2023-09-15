import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );
    if (!requiredPermission) {
      // If the route doesn't have a permission requirement, allow access
      return true;
    }

    // Logic to check if the user has the required permission
    // You would typically access the user's permissions from the request context
    // For the sake of example, let's assume you have a 'user' property in the request
    const user = context.switchToHttp().getRequest().user;

    // Check if the user has the required permission
    const hasPermission =
      user && user.permissions && user.permissions.includes(requiredPermission);

    return hasPermission;
  }
}
