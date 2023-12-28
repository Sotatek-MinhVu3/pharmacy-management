import { Module } from '@nestjs/common';
import { RackController } from './rack.controller';
import { SharedModule } from '../shared/shared.module';
import { RackService } from './rack.service';
import { DrugModule } from '../drug/drug.module';

@Module({
  imports: [SharedModule, DrugModule],
  providers: [RackService],
  controllers: [RackController],
})
export class RackModule {}
