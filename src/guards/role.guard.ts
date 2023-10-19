import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: string[]) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRole = context.switchToHttp().getRequest().user.role;
    if (this.roles.includes(userRole)) {
      return true;
    }
    return false;
  }
}
