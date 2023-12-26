import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { BranchModule } from './modules/branch/branch.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { CategoryModule } from './modules/category/category.module';
import { DrugModule } from './modules/drug/drug.module';
import { RackModule } from './modules/rack/rack.module';

@Module({
  imports: [
    UserModule,
    BranchModule,
    SupplierModule,
    CategoryModule,
    SupplierModule,
    DrugModule,
    SharedModule,
    RackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
