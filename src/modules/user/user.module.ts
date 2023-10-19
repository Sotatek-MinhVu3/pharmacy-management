import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserPublicController } from './user.public.controller';
import { SharedModule } from '../shared/shared.module';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController, UserPublicController],
})
export class UserModule {}
