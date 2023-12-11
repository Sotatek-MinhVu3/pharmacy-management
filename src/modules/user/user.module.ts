require('dotenv').config();
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserPublicController } from './user.public.controller';
import { SharedModule } from '../shared/shared.module';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';
import { AdminService } from './services/admin.service';
import { BranchAdminService } from './services/branch-admin.service';
import { StaffService } from './services/staff.service';
import { CustomerService } from './services/customer.service';
import { BranchModule } from '../branch/branch.module';
import { BranchService } from '../branch/branch.service';

@Module({
  imports: [
    SharedModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    BranchModule,
  ],
  providers: [
    UserService,
    AdminService,
    BranchAdminService,
    StaffService,
    CustomerService,
    JwtStrategy,
    BranchService,
  ],
  controllers: [UserController, UserPublicController],
})
export class UserModule {}
