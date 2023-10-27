import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CategoryModule } from 'src/modules/category/category.module';
import { ProductTypeService } from 'src/modules/category/product-type/product-type.service';
import { SharedModule } from 'src/modules/shared/shared.module';

const productTypes = [
  { categoryId: 1, name: 'Vitamin & khoáng chất' },
  { categoryId: 1, name: 'Sinh lý - nội tiết tố' },
  { categoryId: 1, name: 'Hỗ trợ tiêu hóa' },
  { categoryId: 1, name: 'Hỗ trợ tim mạch' },
  { categoryId: 2, name: 'Hệ tim mạch & tạo máu' },
  { categoryId: 2, name: 'Thuốc kháng sinh' },
  { categoryId: 2, name: 'Thuốc chống ung thư' },
  { categoryId: 2, name: 'Hệ thần kinh trung ương' },
  { categoryId: 2, name: 'Hệ tiêu hóa & gan mật' },
  { categoryId: 2, name: 'Hệ tiết niệu - sinh dục' },
  { categoryId: 2, name: 'Hormone' },
  { categoryId: 2, name: 'Hệ hô hấp' },
  { categoryId: 2, name: 'Dị ứng & hệ miễn dịch' },
  { categoryId: 2, name: 'Hệ nội tiết & chuyển hóa' },
  { categoryId: 2, name: 'Sản phẩm dinh dưỡng' },
  { categoryId: 2, name: 'Thuốc dùng ngoài' },
  { categoryId: 2, name: 'Thuốc giải độc, khử độc' },
  { categoryId: 2, name: 'Thuốc da liễu' },
  { categoryId: 2, name: 'Hệ cơ xương' },
  { categoryId: 2, name: 'Thuốc ngừa thai' },
  { categoryId: 2, name: 'Mắt' },
  { categoryId: 2, name: 'Vitamin & khoáng chất' },
  {
    categoryId: 2,
    name: 'Thuốc gây mê - gây tê, chế phẩm dùng trong phẫu thuật và chăm sóc vết thương',
  },
  {
    categoryId: 2,
    name: 'Dung dịch tiêm tĩnh mạch & các loại dung dịch vô trùng khác',
  },
  { categoryId: 2, name: 'Miếng dán, cao xoa, dầu' },
  { categoryId: 2, name: 'Khác' },
  { categoryId: 3, name: 'Hỗ trợ tình dục' },
  { categoryId: 3, name: 'Vệ sinh cá nhân' },
  { categoryId: 3, name: 'Chăm sóc răng miệng' },
  { categoryId: 3, name: 'Tinh dầu các loại' },
  { categoryId: 3, name: 'Đồ dùng gia đình' },
  { categoryId: 4, name: 'Dụng cụ y tế' },
  { categoryId: 4, name: 'Dụng cụ theo dõi' },
  { categoryId: 4, name: 'Dụng cụ sơ cứu' },
  { categoryId: 4, name: 'Khẩu trang' },
];

@Injectable()
class ProductTypeSeeder {
  constructor(private readonly productTypeService: ProductTypeService) {}
  seed() {
    productTypes.forEach(async (category) => {
      await this.productTypeService.create(category);
    });
  }
}

@Module({
  imports: [SharedModule, ProductTypeSeederModule, CategoryModule],
  providers: [ProductTypeSeeder, ProductTypeService],
})
class ProductTypeSeederModule {
  constructor(private readonly categorySeeder: ProductTypeSeeder) {
    this.categorySeeder.seed();
  }
}

const run = async () => {
  const consumer = await NestFactory.create(ProductTypeSeederModule);
  await consumer.init();
};

run().catch((e) => {
  console.error(e);
  throw e;
});
