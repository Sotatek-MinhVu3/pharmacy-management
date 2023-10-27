import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CategoryModule } from 'src/modules/category/category.module';
import { CategoryService } from 'src/modules/category/category.service';
import { SharedModule } from 'src/modules/shared/shared.module';

const categories = [
  { name: 'Thực phẩm chức năng' },
  { name: 'Thuốc' },
  { name: 'Chăm sóc cá nhân' },
  { name: 'Thiết bị cá nhân' },
];

@Injectable()
class CategorySeeder {
  constructor(private readonly categoryService: CategoryService) {}
  seed() {
    categories.forEach(async (category) => {
      await this.categoryService.create(category);
    });
  }
}

@Module({
  imports: [SharedModule, CategoryModule],
  providers: [CategorySeeder, CategoryService],
})
class CategorySeederModule {
  constructor(private readonly categorySeeder: CategorySeeder) {
    this.categorySeeder.seed();
  }
}

const run = async () => {
  const consumer = await NestFactory.create(CategorySeederModule);
  await consumer.init();
};

run().catch((e) => {
  console.error(e);
  throw e;
});
