require('dotenv').config();

import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ERole } from 'src/modules/shared/constants';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: ERole;
    phone: string;
  }) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      throw new BadRequestException('Invalid access token');
    }
    return user;
  }
}
