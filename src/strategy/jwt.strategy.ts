require('dotenv').config();

import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERole } from 'src/modules/shared/constants';
import { BranchAdminService } from 'src/modules/user/services/branch-admin.service';
import { StaffService } from 'src/modules/user/services/staff.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly branchAdminService: BranchAdminService,
    private readonly staffService: StaffService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { id: number; email: string; role: ERole }) {
    const existedUser = await this.userService.getUserByEmail(payload.email);
    if (!existedUser) {
      throw new BadRequestException('Invalid access token');
    }
    let user;
    if (payload.role === ERole.BRANCH_ADMIN) {
      const branchAdmin = await this.branchAdminService.getById(payload.id);
      user = { ...existedUser, branchId: branchAdmin.branchId };
    } else if (payload.role === ERole.STAFF) {
      const staff = await this.staffService.getById(payload.id);
      user = { ...existedUser, branchId: staff.branchId };
    } else {
      user = existedUser;
    }
    return user;
  }
}
