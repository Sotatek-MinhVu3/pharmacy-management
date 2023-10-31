import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { BranchModule } from './modules/branch/branch.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    UserModule,
    BranchModule,
    SupplierModule,
    CategoryModule,
    SupplierModule,
    ProductModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
