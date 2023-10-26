import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EUserStatus } from 'src/modules/shared/constants';

@Injectable()
export class StatusGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userStatus = context.switchToHttp().getRequest().user.status;
    if (userStatus === EUserStatus.ACTIVE) {
      return true;
    }
    return false;
  }
}
